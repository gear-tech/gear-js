type PaginationParameters = {
  limit?: number;
  offset?: number;
};

type PaginationResponse<T> = {
  result: T[];
  count: number;
};

export type { PaginationParameters, PaginationResponse };
