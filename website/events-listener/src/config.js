import dotenv from 'dotenv';
dotenv.config();

export default {
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: process.env.KAFKA_BROKERS.split(','),
    sasl: {
      username: process.env.KAFKA_SASL_USERNAME,
      password: process.env.KAFKA_SASL_PASSWORD,
    },
  },
  api: {
    provider: process.env.WS_PROVIDER,
  },
};
