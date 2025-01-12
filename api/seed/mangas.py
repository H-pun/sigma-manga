from sqlalchemy.orm import Session
from datetime import datetime
from api.database import Manga, Genre

genres = [
    Genre(name="Action"),
    Genre(name="Adventure"),
    Genre(name="Comedy"),
    Genre(name="Drama"),
    Genre(name="Fantasy"),
    Genre(name="Horror"),
    Genre(name="Martial Arts"),
    Genre(name="Romance"),
    Genre(name="Sci-Fi"),
    Genre(name="Slice of Life"),
    Genre(name="Supernatural"),
    Genre(name="One Shot"),
    Genre(name="Psychological")
]    

mangas = [
    Manga(
        title="One Piece",
        synopsis="A story about pirates",
        cover_url="https://cdn.myanimelist.net/images/manga/3/250752l.jpg",
        release_date=datetime.strptime("1997-07-22", "%Y-%m-%d"),  # Convert to datetime
        genres=[genres[0], genres[1], genres[4]]
    ),
    Manga(
        title="Naruto",
        synopsis="A story about ninjas",
        cover_url="https://cdn.myanimelist.net/images/manga/1/292025l.jpg",
        release_date=datetime.strptime("1999-09-21", "%Y-%m-%d"),
        genres=[genres[0], genres[1], genres[4]]
    ),
    Manga(
        title="Bleach",
        synopsis="A story about shinigami",
        cover_url="https://cdn.myanimelist.net/images/manga/3/299567l.jpg",
        release_date=datetime.strptime("2001-08-07", "%Y-%m-%d"),
        genres=[genres[0], genres[1], genres[4]]
    ),
    Manga(
        title="Dragon Ball",
        synopsis="A story about martial artists",
        cover_url="https://cdn.myanimelist.net/images/manga/1/267793l.jpg",
        release_date=datetime.strptime("1984-11-20", "%Y-%m-%d"),
        genres=[genres[0], genres[1], genres[4]]
    ),
    Manga(
        title="Attack on Titan",
        synopsis="A story about titans",
        cover_url="https://cdn.myanimelist.net/images/manga/2/37846l.jpg",
        release_date=datetime.strptime("2009-09-09", "%Y-%m-%d"),
        genres=[genres[0], genres[3]]
    ),
    Manga(
        title="My Hero Academia",
        synopsis="A story about heroes",
        cover_url="https://cdn.myanimelist.net/images/manga/1/209370l.jpg",
        release_date=datetime.strptime("2014-07-07", "%Y-%m-%d"),
        genres=[genres[0]]
    ),
    Manga(
        title="Black Clover",
        synopsis="A story about magic knights",
        cover_url="https://cdn.myanimelist.net/images/manga/1/150073l.jpg",
        release_date=datetime.strptime("2015-02-16", "%Y-%m-%d"),
        genres=[genres[0], genres[4]]
    )
]

def seed_mangas(db: Session) -> None:
    if db.query(Manga).count() == 0:
        print("seeding mangas...")
        db.add_all(genres)
        db.add_all(mangas)