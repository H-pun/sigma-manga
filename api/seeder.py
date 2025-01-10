from sqlalchemy.orm import Session
from api.core.db import engine as core_engine
from api.seed.users import seed_users

def seed_all(engine = core_engine, minimal = False):
    with Session(engine) as db:
        try:
            seed_users(db)
            db.commit()
            print("Seeding completed.")
        finally:
            db.close()

# py -m api.seeder
if __name__ == "__main__":
    seed_all()
