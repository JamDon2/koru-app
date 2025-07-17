from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlmodel import Session, select

from api.core.config import settings
from api.core.gocardless import (
    CreateRequisitionResponse,
    GoCardlessAPIError,
    create_requisition,
    get_institutions,
    get_requisition,
)
from api.core.redis import get_gocardless_requisition, store_gocardless_requisition
from api.db.database import get_db
from api.dependencies import get_user
from api.models.connection import Connection, ConnectionRead, ConnectionType
from api.models.user import User
from api.schemas.gocardless import Institution
from api.tasks.gocardless import import_requisition

router = APIRouter(prefix="/connection", tags=["Account Connection"])


@router.get("")
def get_connections(
    user: Annotated[User, Depends(get_user)],
    db: Annotated[Session, Depends(get_db)],
) -> list[ConnectionRead]:
    return [
        ConnectionRead.model_validate(connection)
        for connection in db.exec(
            select(Connection).where(Connection.user_id == user.id)
        ).all()
    ]


@router.get("/institutions")
def get_available_institutions(
    user: Annotated[User, Depends(get_user)],
    country: str | None = None,
) -> list[Institution]:
    """
    Get available institutions (banks) from GoCardless.
    Optionally filter by country code (e.g., 'DE' for Germany, 'NL' for Netherlands).
    """
    try:
        institutions = get_institutions(country)
        return institutions
    except GoCardlessAPIError as e:
        # Log the error but return an empty list to avoid breaking the frontend
        print(f"Error fetching institutions: {e}")
        return []


class CreateGocardlessConnection(BaseModel):
    institution_id: str


TEMP_REQUISITION_EXPIRATION = 60 * 60 * 24 * 7


@router.post("/gocardless")
def create_gocardless_connection(
    data: CreateGocardlessConnection,
    user: Annotated[User, Depends(get_user)],
) -> CreateRequisitionResponse:
    requisition = create_requisition(
        data.institution_id, f"{settings.APP_URL}/api/connection/gocardless/callback"
    )

    store_gocardless_requisition(requisition.id, user.id, TEMP_REQUISITION_EXPIRATION)

    return requisition


@router.get("/gocardless/callback")
def gocardless_callback(
    ref: str,  # GoCardless gives us a ref query param with the requisition ID
    db: Annotated[Session, Depends(get_db)],
) -> RedirectResponse:
    user_id = get_gocardless_requisition(ref)

    if user_id is None:
        return RedirectResponse(url="/")

    try:
        requisition = get_requisition(ref)

        # Check if the requisition is already in the database
        connection = db.exec(
            select(Connection).where(Connection.internal_id == ref)
        ).first()
        if connection is not None:
            return RedirectResponse(url="/")

        # We now know that the requisition is valid, we can add it to the database
        connection = Connection(
            user_id=user_id,
            connection_type=ConnectionType.GOCARDLESS,
            internal_id=ref,
            institution_id=requisition.institution_id,
        )

        db.add(connection)
        db.commit()

        import_requisition.delay(connection.id)

        return RedirectResponse(url="/")
    except GoCardlessAPIError:
        return RedirectResponse(url="/")
