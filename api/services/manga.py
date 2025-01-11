from sqlalchemy.orm import Session, joinedload
from uuid import UUID

from api.database import Manga
from api.schemas.manga import DetailManga, CreateManga, UpdateManga
from api.schemas.pagination import Pagination, FilterParams


async def get_all_mangas(db: Session, *, filter: FilterParams):
    query = db.query(Manga)
    if filter.search:
        query = query.filter(Manga.name.ilike(f"%{filter.search}%"))
    return Pagination.from_query(DetailManga, query, filter)


async def get_manga(db: Session, id: UUID) -> DetailManga:
    manga = db.query(Manga).filter(Manga.id == id).one()
    return DetailManga.model_validate(manga)


async def create_manga(db: Session, *, data: CreateManga) -> DetailManga:
    db_row = Manga(**data.model_dump())
    db.add(db_row)
    db.commit()
    db.refresh(db_row)
    return DetailManga.model_validate(db_row)


async def update_manga(db: Session, *, data: UpdateManga):
    # TODO: Add password update logic
    db.query(Manga).filter(Manga.id == data.id).update(data.model_dump())
    db.commit()


async def delete_manga(db: Session, *, manga_id: UUID):
    manga: Manga = db.query(Manga).filter(Manga.id == manga_id).one()
    db.delete(manga)
    db.commit()