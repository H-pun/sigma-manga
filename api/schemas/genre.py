from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID


class CreateGenre(BaseModel):
    name: str = Field(..., examples=['Fantasy'])
    model_config = ConfigDict(
        from_attributes=True,
        str_strip_whitespace=True
    )

class UpdateGenre(CreateGenre):
    id: UUID
    pass


class DetailGenre(UpdateGenre):
    created_at: datetime
    updated_at: datetime
