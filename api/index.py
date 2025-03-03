from fastapi import FastAPI
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware

from api.core.config import settings
from api.core.exception import register_exception_handlers
from api.controller.main import api_router


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"

app = FastAPI(
    title=settings.PROJECT_NAME,
    root_path=settings.API_V1_STR,
    swagger_ui_parameters={"operationsSorter": "method"},
    generate_unique_id_function=custom_generate_unique_id
)

register_exception_handlers(app)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        # allow_origins=[
        #     str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        # ],
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router)
