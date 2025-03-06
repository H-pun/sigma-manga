from typing import List
from uuid import UUID, uuid4
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Table, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4, sort_order=-1)


# note for a Core table, we use the sqlalchemy.Column construct,
# not sqlalchemy.orm.mapped_column
assoc_manga_genre = Table(
    "assoc_manga_genres",
    Base.metadata,
    Column("id_manga", ForeignKey("mangas.id"), primary_key=True),
    Column("id_genre", ForeignKey("genres.id"), primary_key=True)
)


class User(Base):
    __tablename__ = 'users'

    name: Mapped[str]
    username: Mapped[str] = mapped_column(unique=True, index=True)
    password: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True, index=True)
    access_token: Mapped[str] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Genre(Base):
    __tablename__ = 'genres'

    name: Mapped[str]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    mangas: Mapped[List['Manga']] = relationship(back_populates='genres', secondary=assoc_manga_genre)


class Manga(Base):
    __tablename__ = 'mangas'

    title: Mapped[str]
    synopsis: Mapped[str]
    cover_url: Mapped[str]
    release_date: Mapped[datetime]
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    genres: Mapped[List['Genre']] = relationship(back_populates='mangas', secondary=assoc_manga_genre)
