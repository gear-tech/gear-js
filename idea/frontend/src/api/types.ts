type PaginationModel = {
  publicKeyRaw?: string | null;
  source?: string | null;
  destination?: string | null;
  limit?: number;
  offset?: number;
  type?: string;
  query?: string;
};

type PaginationParameters = {
  limit?: number;
  offset?: number;
};

type PaginationResponse<T> = {
  result: T[];
  count: number;
};

export type { PaginationModel, PaginationParameters, PaginationResponse };
