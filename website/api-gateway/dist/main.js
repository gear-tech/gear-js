'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const core_1 = require('@nestjs/core');
const app_module_1 = require('./app.module');
const common_1 = require('@nestjs/common');
const express = require('express');
const configuration_1 = require('./config/configuration');
const logger = new common_1.Logger('Main');
async function bootstrap() {
  const port = (0, configuration_1.default)().server.port;
  console.log((0, configuration_1.default)());
  const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.setGlobalPrefix('api');
  logger.log(`App successfully run on the ${port} 🚀`);
  await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map
