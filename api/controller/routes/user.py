from fastapi import APIRouter

from api.controller.deps import SessionDep, TokenDep, CurrentUser
from api.services.user import get_all_users, get_user, update_user, delete_user, create_user, authenticate_user
from api.schemas.user import DetailUser, CreateUser, UpdateUser, AuthenticateUser
from api.schemas.pagination import Pagination, FilterQuery

router = APIRouter()


@router.get("/me")
async def get_me(current_user: CurrentUser) -> DetailUser:
    return DetailUser.model_validate(current_user)


@router.post("/login")
async def login(db: SessionDep, user: AuthenticateUser) -> DetailUser:
    return await authenticate_user(db, data=user)


@router.get("")
async def get_all(db: SessionDep, filter: FilterQuery) -> Pagination[DetailUser]:
    return await get_all_users(db, filter=filter)


@router.get("/{id}")
async def get(db: SessionDep, id: int) -> DetailUser:
    return await get_user(db, id)


@router.post("", status_code=201)
async def create(db: SessionDep, user: CreateUser) -> DetailUser:
    return await create_user(db, data=user)


@router.put("")
async def update(db: SessionDep, user: UpdateUser, token: TokenDep):
    await update_user(db, data=user, id=token.sub)
    return {"message": "success"}


@router.delete("")
async def delete(db: SessionDep, id: int):
    await delete_user(db, user_id=id)
    return {"message": "success"}
