'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const dotenv_1 = require('dotenv');
(0, dotenv_1.config)();
exports.default = {
  kafka: {
    clientId: process.env.CLIENT_ID,
    groupId: process.env.GROUP_ID,
    brokers: process.env.KAFKA_BROKERS.split(','),
  },
  db: {
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
  },
  gear: {
    providerAddress: process.env.WS_PROVIDER,
    accountSeed: process.env.TEST_ACCOUNT_SEED,
    rootAccountSeed: process.env.ROOT_ACCOUNT_SEED,
    accountBalance: process.env.TEST_ACCOUNT_BALANCE,
    balanceToTransfer: process.env.TEST_BALANCE_VALUE,
  },
};
//# sourceMappingURL=config.js.map
