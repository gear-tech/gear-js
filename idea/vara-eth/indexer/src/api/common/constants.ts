export const API_CONSTANTS = {
  PAGINATION: {
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 1000,
    DEFAULT_OFFSET: 0,
  },
  RATE_LIMIT: {
    TTL: 60, // Time window in seconds
    LIMIT: 100, // Max requests per TTL
  },
} as const;
