export interface Manga {
  id: string;
  title: string;
  genres: string[];
  synopsis: string;
  coverUrl: string;
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface MangaCountByYear {
  year: number;
  count: number;
}
