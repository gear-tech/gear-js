import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ConsumerModule } from './consumer/consumer.module';
import { MessageModule } from './message/message.module';
import { MetadataModule } from './metadata/metadata.module';
import { ProgramModule } from './program/program.module';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import configurations from './config/configuration';
import { Message, Meta, Program } from './entities';

const entities = [Meta, Message, Program];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurations],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        synchronize: false,
        entities,
      }),
      inject: [ConfigService],
    }),
    ConsumerModule,
    ProgramModule,
    MessageModule,
    MetadataModule,
    HealthcheckModule,
  ],
  controllers: [HealthcheckController],
})
export class AppModule {}
