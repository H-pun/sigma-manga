import axios from "@/lib/axios";
import type { Genre } from "@/types/genre";
import type { Manga } from "@/types/manga";
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

export const addManga = async (
  title: string,
  synopsis: string,
  releaseDate: string,
  coverUrl: string
) => {
  try {
    const response = await axios.post<Manga>("/manga", { title, synopsis, releaseDate, coverUrl });

    return response.data;
  } catch (error) {
    console.error("Error adding manga:", error);
    return null;
  }
};
