import dotenv from 'dotenv';
dotenv.config();

export const config = {
  examplesDir: process.env.WASM_EXAMPLES_PATH,
};
