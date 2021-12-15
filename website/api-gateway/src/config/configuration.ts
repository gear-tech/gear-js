export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  kafka: {
    clientId: 'gear', //process.env.CLIENT_ID,
    groupId: 'gear-main', //process.env.GROUP_ID,
    brokers: process.env.BROKERS.split(','),
  },
});
