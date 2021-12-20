'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  kafka: {
    clientId: 'gear',
    groupId: 'gear-main',
    brokers: process.env.BROKERS.split(','),
  },
});
//# sourceMappingURL=configuration.js.map
