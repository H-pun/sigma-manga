export interface Pagination<T> {
  total: number; // Total Data Count
  pages: number; // Total Pages
  size: number; // Page Size
  page: number; // Current Page
  data: T[];
}
