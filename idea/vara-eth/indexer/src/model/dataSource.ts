import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

import { Code, HashRegistry, Program } from './entities/index.js';

dotenv.config({ quiet: true });

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  synchronize: process.env.NODE_ENV === 'development',
  migrationsRun: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [Program, Code, HashRegistry],
  migrations: ['db/migrations/*.js'],
});

export default AppDataSource;
