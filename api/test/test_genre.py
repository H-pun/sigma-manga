import time
from unittest.mock import patch

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import timedelta

from api.database import Genre
from api.core.security import decode_access_token, get_id_from_header

base_url = "/genre"


def test_create(client: TestClient, db: Session):
    name = "newgenre"
    data = {"name": name}
    r = client.post(base_url, json=data)
    assert r.status_code == 201

    genre = r.json()
    assert "id" in genre
    assert "name" in genre
    assert "created_at" in genre
    assert "updated_at" in genre

    assert genre["name"] == name


def test_update(client: TestClient, db: Session, user_token: dict[str, str]):
    time.sleep(1)  # Memberikan waktu agar `updated_at` berubah
    genre_db = db.query(Genre).filter(Genre.name == "newgenre").one()
    name = "updatedgenre"
    data = {"id": str(genre_db.id), "name": name}
    r = client.put(base_url, json=data, headers=user_token)
    assert r.status_code == 200

    genre = r.json()
    assert genre["message"] == "success"

    # Verify the user was updated in the database
    genre_db = db.query(Genre).filter(Genre.name == name).one()
    assert genre_db.name == name
    assert (genre_db.updated_at - genre_db.created_at) > timedelta(seconds=0)


def test_get_genre_by_id(client: TestClient, db: Session):
    genre_db = db.query(Genre).filter(Genre.name == "updatedgenre").one()
    r = client.get(f"{base_url}/{genre_db.id}")
    assert r.status_code == 200

    genre = r.json()
    assert "id" in genre
    assert "name" in genre
    assert "created_at" in genre
    assert "updated_at" in genre

    assert genre["id"] == str(genre_db.id)


# TODO: Add test for delete other user
def test_delete_genre(client: TestClient, db: Session):
    genre = db.query(Genre).filter(Genre.name == "updatedgenre").one()
    r = client.delete(base_url, params={"id": genre.id})
    assert r.status_code == 200

    user = r.json()
    assert user["message"] == "success"

    user_db = db.query(Genre).filter(Genre.id == genre.id).first()
    assert user_db is None
