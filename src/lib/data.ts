import axios from "@/lib/axios";
import type { Genre } from "@/types/genre";
import type { Manga, MangaCountByYear } from "@/types/manga";
import type { Pagination } from "@/types/pagination";

export const fetchGenres = async (value: string) => {
  try {
    const response = await axios.get<Pagination<Genre>>("/genre", {
      params: { page: 1, size: 100, search: value },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const addGenre = async (name: string) => {
  try {
    const response = await axios.post<Genre>("/genre", { name });

    return response.data;
  } catch (error) {
    console.error("Error adding genre:", error);
    return null;
  }
};

export const deleteGenre = async (id: string) => {
  try {
    await axios.delete("/genre", { params: { id } });

    return true;
  } catch (error) {
    console.error("Error deleting genre:", error);
    return false;
  }
};

export const updateGenre = async (id: string, name: string) => {
  try {
    const response = await axios.put<Genre>("/genre", { id, name });

    return response.data;
  } catch (error) {
    console.error("Error updating genre:", error);
    return null;
  }
};

export const fetchMangas = async (value: string) => {
  try {
    const response = await axios.get<Pagination<Manga>>("/manga", {
      params: { page: 1, size: 100, search: value },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const fetchMangaCountByYear = async (year: number) => {
  try {
    const response = await axios.get<MangaCountByYear[]>("/manga/year-count", {
      params: { year },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const addManga = async (
  title: string,
  synopsis: string,
  releaseDate: string,
  coverUrl: string
) => {
  try {
    const response = await axios.post<Manga>("/manga", {
      title,
      synopsis,
      releaseDate,
      coverUrl,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding manga:", error);
    return null;
  }
};

export const deleteManga = async (id: string) => {
  try {
    await axios.delete("/manga", { params: { id } });

    return true;
  } catch (error) {
    console.error("Error deleting manga:", error);
    return false;
  }
};

export const updateManga = async (
  id: string,
  title: string,
  synopsis: string,
  releaseDate: string,
  coverUrl: string
) => {
  try {
    const response = await axios.put<Manga>("/manga", {
      id,
      title,
      synopsis,
      releaseDate,
      coverUrl,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating manga:", error);
    return null;
  }
};
