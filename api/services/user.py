from sqlalchemy.orm import Session, joinedload
from uuid import UUID

from api.database import User
from api.core.exception import AuthenticationError
from api.core.security import hash_password, verify_password, create_access_token
from api.core.utils import generate_random_string
from api.core.config import settings
from api.schemas.user import DetailUser, CreateUser, UpdateUser, AuthenticateUser
from api.schemas.pagination import Pagination, FilterParams


async def authenticate_user(db: Session, *, data: AuthenticateUser) -> DetailUser:
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(user.password, data.password):
        raise AuthenticationError()  
    user.app_token = create_access_token(user.id)
    db.commit()
    return DetailUser.model_validate(user)


async def get_all_users(db: Session, *, filter: FilterParams) -> Pagination[DetailUser]:
    query = db.query(User)
    if filter.search:
        query = query.filter(User.username.ilike(f"%{filter.search}%"))
    return Pagination.from_query(DetailUser, query, filter)


async def get_user(db: Session, id: UUID) -> DetailUser:
    user = db.query(User).filter(User.id == id).one()
    return DetailUser.model_validate(user)


async def create_user(db: Session, *, data: CreateUser) -> DetailUser:
    data.password = hash_password(data.password)
    db_row = User(**data.model_dump())
    db.add(db_row)
    db.commit()
    db.refresh(db_row)
    db_row.app_token = create_access_token(db_row.id)
    db.commit()
    return DetailUser.model_validate(db_row)


async def update_user(db: Session, *, data: UpdateUser, id: UUID):
    # TODO: Add password update logic
    data.password = hash_password(data.password)
    db.query(User).filter(User.id == id).update(data.model_dump())
    db.commit()


async def delete_user(db: Session, *, user_id: UUID):
    user: User = db.query(User).filter(User.id == user_id).one()
    db.delete(user)
    db.commit()
