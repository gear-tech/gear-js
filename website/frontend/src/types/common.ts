export type PaginationModel = {
  publicKeyRaw?: string | null;
  source?: string | null;
  destination?: string | null;
  limit?: number;
  offset?: number;
  type?: string;
};

export type UserPrograms = {
  publicKeyRaw: string | null;
  limit?: number;
  offset?: number;
};

export type SearchQueryModel = {
  type: number;
  query: string;
};
