import express from 'express';
import cors from 'cors';
import { postgraphile, PostGraphileOptions } from 'postgraphile';
import dotenv from 'dotenv';
import { createServer } from 'node:http';

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

export async function runServer() {
  const database = process.env.DATABASE_URL || 'indexer';

  const options: PostGraphileOptions = {
    watchPg: isDev,
    graphiql: true,
    enhanceGraphiql: true,
    subscriptions: true,
    dynamicJson: true,
    setofFunctionsContainNulls: false,
    disableDefaultMutations: true,
    ignoreRBAC: false,
    showErrorStack: isDev ? 'json' : true,
    extendedErrors: ['hint', 'detail', 'errcode'],
    allowExplain: isDev,
    legacyRelations: 'omit',
    exportGqlSchemaPath: `${__dirname}/schema.graphql`,
    sortExport: true,
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
      console.log(`PostGraphiQL available at ${href} 🚀`);
    } else {
      console.log(`PostGraphile listening on ${address} 🚀`);
    }
  });
}

if (require.main === module) {
  runServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
