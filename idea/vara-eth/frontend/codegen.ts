import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.VITE_EXPLORER_URL, // needs --require dotenv/config
  documents: ['src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/shared/graphql/': {
      preset: 'client',
      plugins: [],
      config: {
        scalars: {
          Datetime: 'string', // custom subsquid scalars
          BigInt: 'string',
        },
        avoidOptionals: true,
      },
    },
  },
};

export default config;
