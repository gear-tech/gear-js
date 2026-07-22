import { DataSource } from 'typeorm';

import config from '../config.js';
import { FaucetRequest, MainnetChallenge, MainnetClaim, MainnetClaimEvent, UserLastSeen } from './model/index.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: Number(config.db.port) || 5432,
  username: config.db.user,
  password: config.db.password,
  database: config.db.name,
  synchronize: false,
  migrationsRun: true,
  entities: [UserLastSeen, FaucetRequest, MainnetChallenge, MainnetClaim, MainnetClaimEvent],
  migrations: ['dist/database/migrations/*.js'],
  logging: ['migration', 'error'],
});
