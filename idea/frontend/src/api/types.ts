type PaginationModel = {
  publicKeyRaw?: string | null;
  source?: string | null;
  destination?: string | null;
  limit?: number;
  offset?: number;
  type?: string;
  query?: string;
};

export type { PaginationModel };
