export interface option {
  target: string;
  title: string;
}

export interface PaginationMetadata {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  previousPageLink: string | null;
  nextPageLink: string | null;
}
