from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, EmailStr
from uuid import UUID

class TokenPayload(BaseModel):
    sub: UUID | None = None
    exp: int | None = None
    iat: int | None = None


class AuthenticateUser(BaseModel):
    username: str = Field(..., examples=['whitefall'])
    password: str = Field(..., examples=['password123'])


class BaseUser(BaseModel):
    name: str = Field(..., examples=['Nora Whitefall'])
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=16, pattern=r'^[a-zA-Z0-9]+$', examples=['whitefall'])
    model_config = ConfigDict(
        from_attributes=True,
        str_strip_whitespace=True
    )


class CreateUser(BaseUser):
    password: str = Field(..., min_length=8, examples=['password123'])


class UpdateUser(CreateUser):
    pass


class DetailUser(BaseUser):
    id: UUID
    created_at: datetime
    updated_at: datetime
    app_token: str | None
