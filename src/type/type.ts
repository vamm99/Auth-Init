export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  pagingCounter?: number;
  nextPage?: number | null;
  prevPage?: number | null;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  token?: string;
  meta?: PaginationMeta;
}
