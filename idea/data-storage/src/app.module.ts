import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MessageModule } from './message/message.module';
import { MetadataModule } from './metadata/metadata.module';
import { ProgramModule } from './program/program.module';
import { CodeModule } from './code/code.module';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import configurations from './config/configuration';
import { Block, Code, Message, Meta, Program } from './database/entities';
import { GearModule } from './gear/gear.module';
import { BlockModule } from './block/block.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

const entities = [Meta, Message, Program, Code, Block];

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
    ProgramModule,
    MessageModule,
    MetadataModule,
    GearModule,
    HealthcheckModule,
    CodeModule,
    BlockModule,
    RabbitmqModule,
  ],
  controllers: [HealthcheckController],
})
export class AppModule {}
