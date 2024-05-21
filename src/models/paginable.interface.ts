export default interface Paginable<T> {
    page: number;
    items_per_page: number;
    total: number;
    total_pages: number;
    data: T[];
  }
  