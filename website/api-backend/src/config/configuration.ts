export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  kafka: {
    clientId: 'client-id', //process.env.CLIENT_ID,
    groupId: 'group-id', //process.env.GROUP_ID,
    brokers: ['localhost:9094'], //process.env.BROKERS.split(','),
  },
});
