from typing import List
from uuid import UUID, uuid4
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Table, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4, sort_order=-1)


class User(Base):
    __tablename__ = 'users'

    name: Mapped[str]
    username: Mapped[str] = mapped_column(unique=True, index=True)
    password: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    app_token: Mapped[str] = mapped_column(nullable=True)
