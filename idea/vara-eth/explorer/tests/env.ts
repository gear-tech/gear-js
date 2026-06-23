// Set required env vars before any source module is imported.
// DB_URL must exist because getDatabaseConfig() evaluates it at module load time.
process.env.DB_URL = process.env.DB_URL || 'postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder';
