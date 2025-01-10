from sqlalchemy.orm import Session
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
        cover_url="https://cdn.myanimelist.net/images/manga/3/174651.jpg",
        release_date="1997-07-22",
        genres=[genres[0], genres[1], genres[4]]
    ),
    Manga(
        title="Naruto",
        synopsis="A story about ninjas",
        cover_url="https://cdn.myanimelist.net/images/manga/3/174651.jpg",
        release_date="1999-09-21",
        genres=[genres[0], genres[1], genres[4]]
    ),
    Manga(
        title="Bleach",
        synopsis="A story about shinigami",
        cover_url="https://cdn.myanimelist.net/images/manga/3/174651.jpg",
        release_date="2001-08-07",
        genres=[genres[0], genres[1], genres[4]]
    ),
    Manga(
        title="Dragon Ball",
        synopsis="A story about martial artists",
        cover_url="https://cdn.myanimelist.net/images/manga/3/174651.jpg",
        release_date="1984-11-20",
        genres=[genres[0], genres[1], genres[4]]
    ),
    Manga(
        title="Attack on Titan",
        synopsis="A story about titans",
        cover_url="https://cdn.myanimelist.net/images/manga/3/174651.jpg",
        release_date="2009-09-09",
        genres=[genres[0], genres[3]]
    ),
    Manga(
        title="My Hero Academia",
        synopsis="A story about heroes",
        cover_url="https://cdn.myanimelist.net/images/manga/3/174651.jpg",
        release_date="2014-07-07",
        genres=[genres[0]]
    ),
    Manga(
        title="Black Clover",
        synopsis="A story about magic knights",
        cover_url="https://cdn.myanimelist.net/images/manga/3/174651.jpg",
        release_date="2015-02-16",
        genres=[genres[0], genres[4]]
    )
]

def seed_mangas(db: Session) -> None:
    if db.query(Manga).count() == 0:
        print("seeding mangas...")
        db.add_all(genres)
        db.add_all(mangas)