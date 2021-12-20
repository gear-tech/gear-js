'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const core_1 = require('@nestjs/core');
const app_module_1 = require('./app.module');
const microservices_1 = require('@nestjs/microservices');
const configuration_1 = require('./config/configuration');
async function bootstrap() {
  const configKafka = (0, configuration_1.default)().kafka;
  const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
    transport: microservices_1.Transport.KAFKA,
    options: {
      client: {
        clientId: configKafka.clientId,
        brokers: configKafka.brokers,
      },
      consumer: {
        groupId: configKafka.groupId,
      },
    },
  });
  await app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map
