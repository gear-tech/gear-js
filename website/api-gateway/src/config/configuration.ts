export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID,
    groupId: process.env.KAFKA_GROUP_ID,
    brokers: process.env.KAFKA_BROKERS.split(','),
    sasl: {
      username: process.env.KAFKA_SASL_USERNAME,
      password: process.env.KAFKA_SASL_PASSWORD,
    },
  },
});
