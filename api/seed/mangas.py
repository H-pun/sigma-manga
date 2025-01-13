import requests
from bs4 import BeautifulSoup
from tqdm import tqdm
from sqlalchemy.orm import Session
from datetime import datetime
from api.database import Manga, Genre

limit = 100 # multiples of 50
all_genres = {}
all_mangas = []

def get_or_create_genre(genre_name: str) -> Genre:
    if genre_name not in all_genres:
        all_genres[genre_name] = Genre(name=genre_name)  
    return all_genres[genre_name]

def seed_mangas(db: Session) -> None:
    if db.query(Manga).count() == 0:
        print("seeding mangas...")
        for i in range(0, limit, 50):
            print(f"Processing batch {i} to {i+50}")
            html_manga_links = requests.get(f"https://myanimelist.net/topmanga.php?limit={i}")
            parser_manga_links = BeautifulSoup(html_manga_links.text, "html.parser")

            links = [link["href"] for link in parser_manga_links.select('h3.manga_h3 a.hoverinfo_trigger[href]')]

            for link in tqdm(links):
                html_manga_info = requests.get(link)
                parser_manga_info = BeautifulSoup(html_manga_info.text, "html.parser")

                title = parser_manga_info.select_one("span[itemprop='name']").contents[0].get_text()
                synopsys = parser_manga_info.select_one("span[itemprop='description']").get_text()
                cover_url = parser_manga_info.select_one("img[itemprop='image']")["data-src"]
                release_date = parser_manga_info.select_one('span:-soup-contains("Published:")').next_sibling.get_text().split("to")[0].strip()
                try:
                    release_date = datetime.strptime(release_date, "%b  %d, %Y")
                except ValueError:
                    print(f"Skipping {title} due to invalid release date format: {release_date}")
                    continue
                genre_names = [genre.get_text() for genre in parser_manga_info.select("span[itemprop='genre']")]
                genres = [get_or_create_genre(genre_name) for genre_name in genre_names]
                manga = Manga(
                    title=title,
                    synopsis=synopsys,
                    cover_url=cover_url,
                    release_date=release_date,
                    genres=genres
                )
                all_mangas.append(manga)

        db.add_all(all_genres.values())
        db.add_all(all_mangas)
