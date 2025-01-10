from fastapi import Query
from typing import Annotated, Generic, TypeVar, List
from pydantic import BaseModel, Field
from sqlalchemy.orm import Query as SqlQuery
from fastapi import HTTPException

T = TypeVar("T", bound=BaseModel)


class FilterParams(BaseModel):
    # ge = greater than or equal to 1
    page: int = Field(1, ge=1)
    size: int = Field(100, ge=1)
    search: str | None = None


class Pagination(BaseModel, Generic[T]):
    total: int
    size: int
    page: int
    pages: int
    data: List[T]

    @classmethod
    def from_query(cls, model: T, query: SqlQuery, filter: FilterParams) -> "Pagination[T]":
        total = query.count()
        pages = (total + filter.size - 1) // filter.size if total > 0 else 1
        if filter.page > pages:
            raise HTTPException(status_code=400, detail="Page number exceeds total pages")
        data = query.offset((filter.page - 1) * filter.size).limit(filter.size).all()
        return cls(
            total=total, page=filter.page, size=filter.size, pages=pages,
            data=[model.model_validate(item) for item in data]
        )


FilterQuery = Annotated[FilterParams, Query()]
