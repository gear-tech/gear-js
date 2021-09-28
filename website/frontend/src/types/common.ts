export type PaginationModel = {
  limit?: number;
  offset?: number;
  type?: string;
};

export type SearchQueryModel = {
  type: number;
  query: string;
};
