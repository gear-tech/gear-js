import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import configurations from './config/configuration';

import { MessageModule } from './message/message.module';
import { MetaModule } from './meta/meta.module';
import { ProgramModule } from './program/program.module';
import { CodeModule } from './code/code.module';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { GearModule } from './gear/gear.module';
import { BlockModule } from './block/block.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { StateModule } from './state/state.module';
import { Block, Code, Message, Meta, Program, State } from './database/entities';

const entities = [Meta, Message, Program, Code, Block, State];

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
        synchronize: true,
        entities,
      }),
      inject: [ConfigService],
    }),
    ProgramModule,
    MessageModule,
    MetaModule,
    GearModule,
    HealthcheckModule,
    CodeModule,
    BlockModule,
    RabbitmqModule,
    StateModule,
  ],
  controllers: [HealthcheckController],
})
export class AppModule {}
