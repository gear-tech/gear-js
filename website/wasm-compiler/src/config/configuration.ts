export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 8000,
  },
  db: {
    port: parseInt(process.env.DB_PORT, 10) || 54320,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
  },
  wasmBuild: {
    rootFolder: process.env.WASM_BUILD_FOLDER,
  },
});
