import json
import logging

from fastapi import FastAPI, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError, HTTPException

from httpx import HTTPError
from jwt.exceptions import PyJWTError
from pydantic import ValidationError
from sqlalchemy.exc import NoResultFound, IntegrityError, ProgrammingError


logger = logging.getLogger(__name__)


def _build_validation_errors(exc, title):
    return {
        "errors": [
            {
                "title": title,
                "source": "/".join(map(str, error["loc"])),
                "msg": error["msg"],
            }
            for error in exc.errors()
        ]
    }


def _build_error_dict(title, msg):
    return {
        "errors": [
            {
                "title": title,
                "msg": msg,
            }
        ]
    }


class AuthenticationError(PyJWTError):
    def __init__(self, detail="Could not validate credentials"):
        self.detail = detail
        super().__init__(self.detail)


class DataConflictError(Exception):
    def __init__(self, detail="Data already exists"):
        self.detail = detail


class VerificationError(Exception):
    def __init__(self, detail="Invalid request data"):
        self.detail = detail


async def req_validation_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder(
            _build_validation_errors(exc, "Request Validation Error")
        ),
    )


async def validation_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder(
            _build_validation_errors(exc, "Validation Error")
        ),
    )


async def verification_error_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content=jsonable_encoder(
            _build_error_dict("Verification Error", str(exc))
        )
    )


async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content=jsonable_encoder(
            _build_error_dict("HTTP Exception", exc.detail)
        ),
    )


async def http_error_handler(request, exc):
    data = json.loads(exc.response.text)
    message = "Error"
    if "error_message" in data:
        message = data['error_message']
    elif "message" in data:
        message = data['message']

    logger.exception(f"{message} : {exc.response.url}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=jsonable_encoder(
            _build_error_dict("Http Error", exc.detail)
        )
    )


async def unhandled_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=jsonable_encoder(
            _build_error_dict("Internal Server Error", "Internal Server Error")
        )
    )


async def attribute_error_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder(
            _build_error_dict("Attribute Error", str(exc))
        )
    )


async def sql_error_handler(request, exc):
    logger.exception(str(exc.orig))
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=jsonable_encoder(
            _build_error_dict("Internal Server Error", "Database error occurred")
        )
    )


async def no_result_found_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content=jsonable_encoder(
            _build_error_dict("Not Found Error", str(exc))
        )
    )


async def authentication_error_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        headers={"WWW-Authenticate": "Bearer"},
        content=jsonable_encoder(
            _build_error_dict("Authentication Error", str(exc))
        )
    )


async def data_conflict_error_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content=jsonable_encoder(
            _build_error_dict("Data Conflict Error", str(exc))
        )
    )


def register_exception_handlers(app: FastAPI):
    app.add_exception_handler(ValidationError, validation_handler)
    app.add_exception_handler(RequestValidationError, req_validation_handler)
    app.add_exception_handler(AttributeError, attribute_error_handler)
    app.add_exception_handler(NoResultFound, no_result_found_handler)
    app.add_exception_handler(IntegrityError, sql_error_handler)
    app.add_exception_handler(ProgrammingError, sql_error_handler)
    app.add_exception_handler(HTTPError, http_error_handler)
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(AuthenticationError, authentication_error_handler)
    app.add_exception_handler(DataConflictError, data_conflict_error_handler)
    app.add_exception_handler(VerificationError, verification_error_handler)
