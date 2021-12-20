'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = () => ({
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  kafka: {
    clientId: process.env.CLIENT_ID,
    groupId: process.env.GROUP_ID,
    brokers: process.env.KAFKA_BROKERS.split(','),
  },
});
//# sourceMappingURL=configuration.js.map
