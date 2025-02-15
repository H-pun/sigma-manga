export interface Pagination<T> {
  total: number; // Total Data Count
  pages: number; // Total Pages
  size: number; // Page Size
  page: number; // Current Page
  data: T[];
}

export interface PaginationQuery {
  page: number;
  size: number;
  search: string;
}

export const defaultPaginationQuery: PaginationQuery = {
  page: 1,
  size: 10,
  search: "",
};

export const defaultPagination: Pagination<unknown> = {
  total: 0,
  pages: 0,
  size: 10,
  page: 1,
  data: [],
};
