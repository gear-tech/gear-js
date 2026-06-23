// Set required env vars before any source module is imported.
// Redis env vars must exist because config.ts reads them at module load time.
// Using a non-existent host ensures Redis never actually connects,
// so the Cache decorator falls through to the real DB every time.
process.env.REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
process.env.REDIS_PORT = process.env.REDIS_PORT || '19999';
process.env.REDIS_USER = process.env.REDIS_USER || '';
process.env.REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
