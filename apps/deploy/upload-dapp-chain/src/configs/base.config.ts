export default () => ({
  app: {
    PORT: process.env.PORT || "3000",
  },
  github: {
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN || "token",
    GITHUB_OWNER_REPO: process.env.GITHUB_OWNER_REPO || "owner",
    GITHUB_API_BASE_URL: process.env.GITHUB_OWNER_REPO || "baseUrl",
  },
  bot: {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "bot",
    TELEGRAM_ADMIN_ACCOUNTS: process.env.TELEGRAM_ADMIN_ACCOUNTS,
  },
  dappsPayloadsPath: {
    DAPPS_PAYLOADS_PATH: process.env.DAPPS_PAYLOADS_PATH || "path",
  },
  nftMarketplace: {
    NFT_MARKETPLACE_ADMIN_ID: process.env.NFT_MARKETPLACE_ADMIN_ID || "nftMarketplaceId",
    NFT_MARKETPLACE_TREASURY_ID: process.env.NFT_MARKETPLACE_TREASURY_ID || "treasuryId",
  },
  gear: {
    GEAR_ACCOUNT_AL: process.env.GEAR_ACCOUNT_AL || "",
    GEAR_ACCOUNT_BB: process.env.GEAR_ACCOUNT_BB || "",
    WS_PROVIDER: process.env.WS_PROVIDER || "WS_PROVIDER",
  },
  db: {
    DB_HOST: process.env.DB_HOST || "0.0.0.0",
    DB_PORT: process.env.DB_PORT || 5432,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
  },
});
