from fastapi import APIRouter
from uuid import UUID

from api.controller.deps import SessionDep, TokenDep, CurrentUser
from api.services.manga import get_all_mangas, get_manga, update_manga, delete_manga, create_manga
from api.schemas.manga import DetailManga, CreateManga, UpdateManga
from api.schemas.pagination import Pagination, FilterQuery

router = APIRouter()


@router.get("")
async def get_all(db: SessionDep, filter: FilterQuery) -> Pagination[DetailManga]:
    return await get_all_mangas(db, filter=filter)


@router.get("/{id}")
async def get(db: SessionDep, id: UUID) -> DetailManga:
    return await get_manga(db, id)


@router.post("", status_code=201)
async def create(db: SessionDep, manga: CreateManga) -> DetailManga:
    return await create_manga(db, data=manga)


@router.put("")
async def update(db: SessionDep, manga: UpdateManga):
    await update_manga(db, data=manga)
    return {"message": "success"}


@router.delete("")
async def delete(db: SessionDep, id: UUID):
    await delete_manga(db, manga_id=id)
    return {"message": "success"}
