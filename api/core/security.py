import bcrypt
from typing import Any
from datetime import datetime, timedelta, timezone
from jwt import PyJWTError, encode, decode

from api.core.config import settings
from api.schemas.user import TokenPayload
from api.core.exception import AuthenticationError


ALGORITHM = "HS256"


def create_access_token(subject: str | Any, expires_delta: timedelta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)) -> str:
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {"exp": expire, "sub": str(subject), "iat": datetime.now(timezone.utc)}
    encoded_jwt = encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> TokenPayload:
    try:
        payload = decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        return TokenPayload(**payload)
    except PyJWTError:
        raise AuthenticationError()


def get_id_from_header(token: dict[str, str]) -> int:
    return decode_access_token(token["Authorization"].split(" ")[1]).sub


def verify_password(hashed_password: str, plain_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
