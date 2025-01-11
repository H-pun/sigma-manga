from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from uuid import UUID


class CreateManga(BaseModel):
    title: str = Field(..., examples=['One Punch Man'])
    synopsis: str = Field(..., examples=['A story about a hero'])
    cover_url: str = Field(..., examples=['https://example.com/image.jpg'])
    release_date: datetime = Field(..., examples=['2012-06-14'])
    model_config = ConfigDict(
        from_attributes=True,
        str_strip_whitespace=True
    )

class UpdateManga(CreateManga):
    id: UUID
    pass


class DetailManga(UpdateManga):
    created_at: datetime
    updated_at: datetime
