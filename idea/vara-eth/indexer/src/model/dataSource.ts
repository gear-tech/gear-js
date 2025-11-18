import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Code, Program } from './entities';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'indexer',
  synchronize: process.env.NODE_ENV === 'development',
  migrationsRun: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [Program, Code],
  migrations: ['db/migrations/*.js'],
});

export default AppDataSource;
