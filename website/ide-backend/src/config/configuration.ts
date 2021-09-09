export const configuration = () => ({
  PORT: parseInt(process.env.PORT, 10) || 8000,
  HOST: process.env.HOST || '127.0.0.1',
  IDE_FOLDER: process.env.IDE_FOLDER,
  GSTD_FOLDER: process.env.GSTD_FOLDER,
  WASM_PROC_FOLDER: process.env.WASM_PROC_FOLDER,
});
