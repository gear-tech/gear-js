export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
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
});
