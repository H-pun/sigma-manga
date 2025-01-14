export interface Pagination<T> {
  total: number; // Total Data Count
  pages: number; // Total Pages
  size: number; // Page Size
  page: number; // Current Page
  data: T[];
}

export interface SearchParam {
  page: number;
  size: number;
  search: string;
}

export const defaultPagination = () => {
  return { total: 0, pages: 0, size: 0, page: 0, data: [] };
};
