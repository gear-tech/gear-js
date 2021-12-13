export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  kafka: {
    clientId: process.env.CLIENT_ID,
    groupId: process.env.GROUP_ID,
    brokers: process.env.BROKERS.split(','),
  },
});
