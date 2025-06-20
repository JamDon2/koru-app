from datetime import datetime
from typing import TYPE_CHECKING, Optional

from nanoid import generate
from sqlmodel import Field, Index, Relationship, SQLModel, text

from api.models.enums.transaction import ProcessingStatus

from .base import BaseModel

if TYPE_CHECKING:
    from .account import Account
    from .counterparty import Counterparty


class TransactionBase(SQLModel):
    account_id: str = Field(foreign_key="account.id")
    amount: float
    currency: str
    native_amount: float
    processing_status: ProcessingStatus = Field(default=ProcessingStatus.UNPROCESSED)

    # Counterparty
    opposing_name: str | None = None
    opposing_iban: str | None = None
    opposing_bban: str | None = None

    opposing_counterparty_id: str | None = Field(
        default=None, foreign_key="counterparty.id"
    )
    opposing_account_id: str | None = Field(default=None, foreign_key="account.id")

    # Transaction identifiers
    gocardless_id: str | None = None
    internal_id: str | None = None

    # Transaction metadata
    booking_time: datetime
    value_time: datetime

    __table_args__ = (
        Index(
            "ix_transaction_unique_identifiers",
            text("coalesce(gocardless_id, '')"),
            text("coalesce(internal_id, '')"),
            unique=True,
        ),
    )


class Transaction(TransactionBase, BaseModel, table=True):
    id: str = Field(default_factory=generate, primary_key=True)

    account: "Account" = Relationship(
        back_populates="transactions",
        sa_relationship_kwargs={"foreign_keys": "[Transaction.account_id]"},
    )
    opposing_counterparty: Optional["Counterparty"] = Relationship(
        back_populates="transactions"
    )
    opposing_account: Optional["Account"] = Relationship(
        back_populates="opposing_transactions",
        sa_relationship_kwargs={"foreign_keys": "[Transaction.opposing_account_id]"},
    )


class TransactionCreate(TransactionBase):
    pass


class TransactionRead(TransactionBase):
    id: str


class TransactionReadWithOpposing(TransactionRead):
    opposing_counterparty: Optional["Counterparty"]
    opposing_account: Optional["Account"]
