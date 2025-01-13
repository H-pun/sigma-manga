from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from uuid import UUID

from api.database import Genre, Manga, assoc_manga_genre
from api.schemas.genre import DetailGenre, CreateGenre, UpdateGenre
from api.schemas.pagination import Pagination, FilterParams


async def get_all_genres(db: Session, *, filter: FilterParams) -> Pagination[DetailGenre]:
    # *[getattr(Genre, column.name) for column in Genre.__table__.columns]
    query = (
        db.query(Genre.name, Genre.id,  func.count(
            Manga.id).label('manga_count'), Genre.created_at, Genre.updated_at)
        .outerjoin(assoc_manga_genre, Genre.id == assoc_manga_genre.c.id_genre)
        .outerjoin(Manga, Manga.id == assoc_manga_genre.c.id_manga)
        .group_by(Genre.id, Genre.name, Genre.created_at, Genre.updated_at)
        .order_by(Genre.updated_at.desc())
    )
    if filter.search:
        query = query.filter(Genre.name.ilike(f"%{filter.search}%"))
    return Pagination.from_query(DetailGenre, query, filter)


async def get_genre(db: Session, id: UUID) -> DetailGenre:
    genre = db.query(Genre).filter(Genre.id == id).one()
    return DetailGenre.model_validate(genre)


async def create_genre(db: Session, *, data: CreateGenre) -> DetailGenre:
    db_row = Genre(**data.model_dump())
    db.add(db_row)
    db.commit()
    db.refresh(db_row)
    return DetailGenre.model_validate(db_row)


async def update_genre(db: Session, *, data: UpdateGenre):
    # TODO: Add password update logic
    db.query(Genre).filter(Genre.id == data.id).update(data.model_dump())
    db.commit()


async def delete_genre(db: Session, *, genre_id: UUID):
    genre: Genre = db.query(Genre).filter(Genre.id == genre_id).one()
    db.delete(genre)
    db.commit()
