import express from 'express';
import cors from 'cors';
import { postgraphile, PostGraphileOptions } from 'postgraphile';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { createLogger } from '@gear-js/logger';

dotenv.config({ quiet: true });

const logger = createLogger('explorer');

const isDev = process.env.NODE_ENV === 'development';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runServer() {
  const database = process.env.DB_URL;

  const options: PostGraphileOptions = {
    watchPg: isDev,
    graphiql: true,
    enhanceGraphiql: true,
    subscriptions: true,
    dynamicJson: true,
    setofFunctionsContainNulls: false,
    disableDefaultMutations: true,
    ignoreRBAC: false,
    allowExplain: isDev,
    legacyRelations: 'omit',
    exportGqlSchemaPath: `${__dirname}/schema.graphql`,
    sortExport: true,
    handleErrors: (errors) => {
      errors.forEach((error) => {
        const errorData: any = {
          message: error.message,
          locations: error.locations,
          path: error.path,
        };

        const originalError = error.originalError as any;
        if (originalError) {
          if (originalError.hint) errorData.hint = originalError.hint;
          if (originalError.detail) errorData.detail = originalError.detail;
          if (originalError.code) errorData.errcode = originalError.code;

          if (isDev && (originalError.stack || error.stack)) {
            errorData.stack = originalError.stack || error.stack;
          }
        }

        logger.error(errorData, 'GraphQL Error');
      });
      return errors;
    },
  };

  const middleware = postgraphile(database, 'public', options);

  const app = express();

  app.use(cors());
  app.use(middleware);

  const server = createServer(app);

  const port = process.env.GQL_PORT || 4350;

  server.listen({ host: '0.0.0.0', port }, () => {
    const address = server.address()!;
    if (typeof address !== 'string') {
      const href = `http://${address.address}:${address.port}${options.graphiqlRoute || '/graphiql'}`;
      logger.info(`PostGraphiQL available at ${href} 🚀`);
    } else {
      logger.info(`PostGraphile listening on ${address} 🚀`);
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runServer().catch((error) => {
    logger.error(error);
    process.exit(1);
  });
}
