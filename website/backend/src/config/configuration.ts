export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  db: {
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
  },
});
