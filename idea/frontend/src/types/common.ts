export type PaginationModel = {
  publicKeyRaw?: string | null;
  source?: string | null;
  destination?: string | null;
  limit?: number;
  offset?: number;
  type?: string;
  query?: string;
};

export type UserPrograms = {
  owner: string | null;
  limit?: number;
  offset?: number;
  query?: string;
};

export type SearchQueryModel = {
  type: number;
  query: string;
};
