import dotenv from 'dotenv';
dotenv.config();

export default {
  kafka: {
    clientId: process.env.CLIENT_ID,
    brokers: process.env.BROKERS.split(','),
  },
  api: {
    provider: process.env.WS_PROVIDER,
  },
};
