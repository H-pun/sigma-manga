from fastapi import APIRouter

from api.controller.routes import user

api_router = APIRouter()
api_router.include_router(user.router, prefix="/user", tags=["User"])
