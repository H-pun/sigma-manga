from unittest.mock import patch
from datetime import timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from api.database import User
from api.core.security import verify_password, decode_access_token, get_id_from_header

base_url = "/user"


def test_auth_success(client: TestClient, user_token: dict[str, str]):
    r = client.get(f"{base_url}/me", headers=user_token)
    assert r.status_code == 200

    current_user = r.json()
    assert "id" in current_user
    assert "access_token" in current_user
    assert "password" not in current_user
    assert current_user["username"] == "whitefall"
    assert current_user["email"] == "whitefall@sigma.com"


def test_auth_fail(client: TestClient):
    r = client.get(f"{base_url}/me")
    assert r.status_code == 401


def test_create(client: TestClient, db: Session):
    name = "new user"
    email = "user@test.com"
    username = "newuser"
    password = "newpassword"
    data = {"name": name, "email": email, "username": username, "password": password}
    r = client.post(base_url, json=data)
    assert r.status_code == 201

    user = r.json()
    assert "id" in user
    assert "access_token" in user
    assert "password" not in user
    assert user["email"] == email
    assert user["username"] == username

    user_db = db.query(User).filter(User.username == username).one()
    assert user_db.id == decode_access_token(user_db.access_token).sub
    assert verify_password(user_db.password, password)


def test_update(client: TestClient, db: Session, user_token: dict[str, str]):
    name = "updated user"
    email = "updateduser@test.com"
    username = "updateduser"
    password = "updatedpassword"
    data = {"name": name, "email": email, "username": username, "password": password}
    r = client.put(base_url, json=data, headers=user_token)
    assert r.status_code == 200

    user = r.json()
    assert user["message"] == "success"

    # Verify the user was updated in the database
    id_user = get_id_from_header(user_token)
    user_db = db.query(User).filter(User.id == id_user).one()
    assert user_db.access_token is not None
    assert user_db.email == email
    assert user_db.username == username
    assert verify_password(user_db.password, password)
    assert (user_db.updated_at - user_db.created_at) > timedelta(seconds=0)


def test_get_user_by_id(client: TestClient, db: Session):
    user_db = db.query(User).filter(User.username == "updateduser").one()
    r = client.get(f"{base_url}/{user_db.id}")
    assert r.status_code == 200

    user = r.json()
    assert "id" in user
    assert "name" in user
    assert "email" in user
    assert "username" in user
    assert "access_token" in user
    assert "password" not in user

    assert user["id"] == str(user_db.id)
    assert user["name"] == user_db.name
    assert user["email"] == user_db.email
    assert user["username"] == user_db.username
    assert user["access_token"] == user_db.access_token


# TODO: Add test for delete other user
def test_delete_user(client: TestClient, db: Session):
    user_db = db.query(User).filter(User.username == "updateduser").one()
    r = client.delete(base_url, params={"id": user_db.id})
    assert r.status_code == 200

    user = r.json()
    assert user["message"] == "success"

    user_db = db.query(User).filter(User.username == "updateduser").first()
    assert user_db is None
