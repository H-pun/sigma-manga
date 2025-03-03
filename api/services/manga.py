from sqlalchemy import extract, func
from sqlalchemy.orm import Session, joinedload
from uuid import UUID

from api.database import Manga, Genre, assoc_manga_genre
from api.schemas.manga import DetailManga, CreateManga, UpdateManga, MangaStatsByYear
from api.schemas.pagination import Pagination, FilterParams


async def get_manga_count_by_year(db: Session, year: int = None):
    query = (
        db.query(
            extract('year', Manga.release_date).label('year'),
            func.count(Manga.id).label('count')
        )
        .group_by('year')
        .order_by('year')
    )
    if year:
        query = query.filter(extract('year', Manga.release_date) > year)
    return [MangaStatsByYear.model_validate(row) for row in query.all()]


async def get_all_mangas(db: Session, *, filter: FilterParams):
    # query = db.query(Manga).order_by(Manga.updated_at.desc())

    query = (
        db.query(
            Manga.id,
            Manga.title,
            func.array_agg(Genre.name).label('genres'),
            Manga.release_date,
            Manga.cover_url,
            Manga.synopsis,
            Manga.created_at,
            Manga.updated_at
        )
        .join(assoc_manga_genre, Manga.id == assoc_manga_genre.c.id_manga)
        .join(Genre, Genre.id == assoc_manga_genre.c.id_genre)
        .group_by(Manga.id)
        # .order_by(Manga.title.desc())
    )
    if filter.search:
        if filter.search.startswith("genre_ids:"):
            genre_param = filter.search.split(":")[1].split(";")
            genre_ids = genre_param[0].split(",")
            query = query.filter(Manga.genres.any(Genre.id.in_(genre_ids)))
            print(len(genre_param))
            if len(genre_param) > 1:
                query = query.filter(Manga.title.ilike(f"%{genre_param[1]}%"))
        else:
            query = query.filter(Manga.title.ilike(f"%{filter.search}%"))
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
