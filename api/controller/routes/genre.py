from fastapi import APIRouter
from uuid import UUID

from api.controller.deps import SessionDep, TokenDep, CurrentUser
from api.services.genre import get_all_genres, get_genre, update_genre, delete_genre, create_genre
from api.schemas.genre import DetailGenre, CreateGenre, UpdateGenre
from api.schemas.pagination import Pagination, FilterQuery

router = APIRouter()


@router.get("")
async def get_all(db: SessionDep, filter: FilterQuery) -> Pagination[DetailGenre]:
    return await get_all_genres(db, filter=filter)


@router.get("/{id}")
async def get(db: SessionDep, id: UUID) -> DetailGenre:
    return await get_genre(db, id)


@router.post("", status_code=201)
async def create(db: SessionDep, genre: CreateGenre) -> DetailGenre:
    return await create_genre(db, data=genre)


@router.put("")
async def update(db: SessionDep, genre: UpdateGenre):
    await update_genre(db, data=genre)
    return {"message": "success"}


@router.delete("")
async def delete(db: SessionDep, id: UUID):
    await delete_genre(db, genre_id=id)
    return {"message": "success"}
