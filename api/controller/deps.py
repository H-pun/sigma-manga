from collections.abc import Generator
from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from api.core.security import decode_access_token
from api.core.config import settings
from api.core.db import engine
from api.database import User
from api.schemas.user import TokenPayload
from api.core.exception import AuthenticationError

bearer_scheme = HTTPBearer(
    description="Please insert JWT with Bearer into field",
    auto_error=False
)


def get_db() -> Generator[Session, None, None]:
    with Session(engine) as session:
        try:
            yield session
        finally:
            session.close()


def get_token(token: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> TokenPayload:
    if token is None:
        raise AuthenticationError()
    return decode_access_token(token.credentials)


SessionDep = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[TokenPayload, Depends(get_token)]


def get_current_user(session: SessionDep, token: TokenDep) -> User:
    return session.query(User).filter(User.id == token.sub).one()


CurrentUser = Annotated[User, Depends(get_current_user)]
