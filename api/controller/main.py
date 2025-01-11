from fastapi import APIRouter

from api.controller.routes import user, genre, manga

api_router = APIRouter()
api_router.include_router(user.router, prefix="/user", tags=["User"])
api_router.include_router(genre.router, prefix="/genre", tags=["Genre"])
api_router.include_router(manga.router, prefix="/manga", tags=["Manga"])
