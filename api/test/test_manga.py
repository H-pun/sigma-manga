import time
from unittest.mock import patch

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import timedelta, datetime

from api.database import Manga
from api.core.security import decode_access_token, get_id_from_header

base_url = "/manga"


def test_create(client: TestClient, db: Session):
    title = "newmanga"
    synopsys = "synopsys"
    cover_url = "cover_url"
    release_date = "2021-01-01"

    data = {
        "title": title, 
        "synopsis": synopsys, 
        "cover_url": cover_url, 
        "release_date": release_date
    }

    r = client.post(base_url, json=data)
    assert r.status_code == 201

    manga = r.json()
    assert "id" in manga
    assert "title" in manga
    assert "synopsis" in manga
    assert "cover_url" in manga
    assert "release_date" in manga
    assert "created_at" in manga
    assert "updated_at" in manga

    assert manga["title"] == title


def test_update(client: TestClient, db: Session, user_token: dict[str, str]):
    time.sleep(1)  # Memberikan waktu agar `updated_at` berubah
    manga_db = db.query(Manga).filter(Manga.title == "newmanga").one()
    title = "updatedmanga"
    synopsys = "newsynopsys"
    cover_url = "newcover_url"
    release_date = "2025-01-01"

    data = {
        "id": str(manga_db.id),
        "title": title,
        "synopsis": synopsys,
        "cover_url": cover_url,
        "release_date": release_date
    }
    r = client.put(base_url, json=data, headers=user_token)
    assert r.status_code == 200

    manga = r.json()
    assert manga["message"] == "success"

    # Verify the user was updated in the database
    manga_db = db.query(Manga).filter(Manga.title == title).one()
    assert manga_db.title == title
    assert manga_db.synopsis == synopsys
    assert manga_db.cover_url == cover_url
    assert manga_db.release_date == datetime.strptime("2025-01-01", "%Y-%m-%d")
    assert (manga_db.updated_at - manga_db.created_at) > timedelta(seconds=0)


def test_get_manga_by_id(client: TestClient, db: Session):
    manga_db = db.query(Manga).filter(Manga.title == "updatedmanga").one()
    r = client.get(f"{base_url}/{manga_db.id}")
    assert r.status_code == 200

    manga = r.json()
    assert "id" in manga
    assert "title" in manga
    assert "synopsis" in manga
    assert "cover_url" in manga
    assert "release_date" in manga
    assert "created_at" in manga
    assert "updated_at" in manga

    assert manga["id"] == str(manga_db.id)


# TODO: Add test for delete other user
def test_delete_manga(client: TestClient, db: Session):
    manga = db.query(Manga).filter(Manga.title == "updatedmanga").one()
    r = client.delete(base_url, params={"id": manga.id})
    assert r.status_code == 200

    user = r.json()
    assert user["message"] == "success"

    user_db = db.query(Manga).filter(Manga.id == manga.id).first()
    assert user_db is None
