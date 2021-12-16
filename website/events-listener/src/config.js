import dotenv from 'dotenv';
dotenv.config();

export default {
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: process.env.KAFKA_BROKERS.split(','),
  },
  api: {
    provider: process.env.WS_PROVIDER,
  },
};
