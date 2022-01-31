export type PaginationModel = {
  publicKeyRaw?: string | null;
  source?: string | null;
  destination?: string | null;
  limit?: number;
  offset?: number;
  type?: string;
  term?: string;
};

export type UserPrograms = {
  owner: string | null;
  limit?: number;
  offset?: number;
  term?: string;
};

export type SearchQueryModel = {
  type: number;
  query: string;
};
