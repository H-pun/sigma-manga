from fastapi import APIRouter

from api.controller.routes import user, genre

api_router = APIRouter()
api_router.include_router(user.router, prefix="/user", tags=["User"])
api_router.include_router(genre.router, prefix="/genre", tags=["Genre"])
