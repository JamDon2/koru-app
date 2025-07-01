from sqlmodel import Session, and_, col, func, or_, select

from api.core.celery import app
from api.db.database import engine
from api.models.account import Account
from api.models.enums.transaction import ProcessingStatus
from api.models.merchant import Merchant
from api.models.transaction import Transaction


@app.task
def process_transactions(account_id: str) -> dict[str, int]:
    """
    Enrich transactions with merchant, counterpart, and account information.

    The priority order is: Account, Merchant, Counterparty.

    This means that first we check if the transaction is between accounts,
    if not we try to match it to a merchant, and if that fails,
    we link it to an existing or new counterparty.
    """
    with Session(engine) as session:
        # First, try to bulk process account linkings
        processed_count = _bulk_link_accounts(session, account_id)
        processed_count += _bulk_link_merchants(session, account_id)

        # TODO: Continue with remaining unprocessed transactions
        # - Process counterparty matches

        session.commit()
        return {"processed_transactions": processed_count}


def _bulk_link_accounts(session: Session, account_id: str) -> int:
    """
    Bulk link transactions to opposing accounts when exactly one account matches.

    Returns the number of transactions that were successfully linked.
    """
    match_subquery = (
        select(
            col(Transaction.id).label("transaction_id"),
            col(Account.id).label("account_id"),
            func.count(col(Account.id))
            .over(partition_by=Transaction.id)
            .label("match_count"),
        )
        .select_from(Transaction)
        .join(
            Account,
            or_(
                and_(
                    col(Transaction.opposing_iban).is_not(None),
                    Transaction.opposing_iban == Account.iban,
                ),
                and_(
                    col(Transaction.opposing_bban).is_not(None),
                    Transaction.opposing_bban == Account.bban,
                ),
            ),
        )
        .where(
            Transaction.account_id == account_id,
            Transaction.processing_status == ProcessingStatus.UNPROCESSED,
        )
    ).subquery()

    # Get transactions with exactly one account match
    exact_matches = session.exec(
        select(match_subquery.c.transaction_id, match_subquery.c.account_id).where(
            match_subquery.c.match_count == 1
        )
    ).all()

    if not exact_matches:
        return 0

    transaction_updates = []
    for match in exact_matches:
        transaction_updates.append(
            {
                "id": match.transaction_id,  # type: ignore[attr-defined]
                "opposing_account_id": match.account_id,  # type: ignore[attr-defined]
                "processing_status": ProcessingStatus.PROCESSED,
            }
        )

    if transaction_updates:
        session.bulk_update_mappings(Transaction, transaction_updates)  # type: ignore[arg-type]

    return len(transaction_updates)


def _bulk_link_merchants(session: Session, account_id: str) -> int:
    """
    Bulk link transactions to merchants.

    Returns the number of transactions that were successfully linked.
    """
    match_subquery = (
        select(
            col(Transaction.id).label("transaction_id"),
            col(Merchant.id).label("merchant_id"),
            func.length(Merchant.match_prefix).label("prefix_length"),
            func.row_number()
            .over(
                partition_by=Transaction.id,
                order_by=func.length(Merchant.match_prefix).desc(),
            )
            .label("row_number"),  # This is the order of merchants by specificity
        )
        .select_from(Transaction)
        .join(
            Merchant,
            col(Transaction.opposing_name).ilike(Merchant.match_prefix + "%"),
        )
        .where(
            Transaction.account_id == account_id,
            Transaction.processing_status == ProcessingStatus.UNPROCESSED,
            col(Transaction.opposing_name).is_not(None),
        )
        .subquery()
    )

    best_matches = session.exec(
        select(match_subquery.c.transaction_id, match_subquery.c.merchant_id).where(
            match_subquery.c.row_number == 1
        )
    ).all()

    if not best_matches:
        return 0

    transaction_updates = []
    for match in best_matches:
        transaction_updates.append(
            {
                "id": match.transaction_id,  # type: ignore[attr-defined]
                "opposing_merchant_id": match.merchant_id,  # type: ignore[attr-defined]
                "processing_status": ProcessingStatus.PROCESSED,
            }
        )

    if transaction_updates:
        session.bulk_update_mappings(Transaction, transaction_updates)  # type: ignore[arg-type]

    return len(transaction_updates)
