'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AppModule = void 0;
const common_1 = require('@nestjs/common');
const typeorm_1 = require('@nestjs/typeorm');
const config_1 = require('@nestjs/config');
const consumer_module_1 = require('./consumer/consumer.module');
const messages_module_1 = require('./messages/messages.module');
const metadata_module_1 = require('./metadata/metadata.module');
const programs_module_1 = require('./programs/programs.module');
const configuration_1 = require('./config/configuration');
let AppModule = class AppModule {};
AppModule = __decorate(
  [
    (0, common_1.Module)({
      imports: [
        config_1.ConfigModule.forRoot({
          load: [configuration_1.default],
        }),
        typeorm_1.TypeOrmModule.forRootAsync({
          imports: [config_1.ConfigModule],
          useFactory: (configService) => ({
            type: 'postgres',
            host: configService.get('database.host'),
            port: configService.get('database.port'),
            username: configService.get('database.user'),
            password: configService.get('database.password'),
            database: configService.get('database.name'),
            autoLoadEntities: true,
            synchronize: true,
            entities: ['dist/**/*.entity.js'],
          }),
          inject: [config_1.ConfigService],
        }),
        consumer_module_1.ConsumerModule,
        programs_module_1.ProgramsModule,
        messages_module_1.MessagesModule,
        metadata_module_1.MetadataModule,
      ],
    }),
  ],
  AppModule,
);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
