import { TypeormDatabase } from '@subsquid/typeorm-store';

import config from '../config/configuration';

config();

export const initDB = new TypeormDatabase();
