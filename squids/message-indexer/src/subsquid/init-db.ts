import { TypeormDatabase } from '@subsquid/typeorm-store';
import { config } from 'dotenv';

config();

export const initDB = new TypeormDatabase();
