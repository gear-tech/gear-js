import { checkEnv } from "../common/helpers";

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
    TELEGRAM_BOT_TOKEN: checkEnv(process.env.TELEGRAM_BOT_TOKEN),
  },
  workflow: {
    WORKFLOW_PATH: checkEnv(process.env.WORKFLOW_PATH),
  },
  gear: {
    WS_PROVIDER: checkEnv(process.env.WS_PROVIDER),
  },
  db: {
    DB_HOST: process.env.DB_HOST || "127.0.0.1",
    DB_PORT: process.env.DB_PORT || 5432,
    DB_USER: checkEnv(process.env.DB_USER),
    DB_PASSWORD: checkEnv(process.env.DB_PASSWORD),
    DB_DATABASE: checkEnv(process.env.DB_DATABASE),
  },
});
