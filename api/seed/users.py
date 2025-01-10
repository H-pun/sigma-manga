from sqlalchemy.orm import Session
from api.core.security import hash_password
from api.database import User

users = [
    User(
        name="Nora Whitefall",
        username="whitefall",
        password="password",
        email="whitefall@growtopia.com"
    ),
    User(
        name="string",
        username="string",
        password="string",
        email="string@string.com"
    ),
    User(
        name="test",
        username="test",
        password="test",
        email="test@test.com"
    ),
]


def seed_users(db: Session) -> None:
    if db.query(User).count() == 0:
        print("seeding users...")
        for user in users:
            user.password = hash_password(user.password)
        db.add_all(users)
