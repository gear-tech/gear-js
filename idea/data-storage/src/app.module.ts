import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { ConsumerModule } from './consumer/consumer.module';
import { MessageModule } from './message/message.module';
import { MetadataModule } from './metadata/metadata.module';
import { ProgramModule } from './program/program.module';
import { CodeModule } from './code/code.module';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import configurations from './config/configuration';
import { Block, Code, Message, Meta, Program } from './database/entities';
import { ProducerModule } from './producer/producer.module';
import { GearModule } from './gear/gear.module';
import { TasksModule } from './tasks/tasks.module';
import { BlockModule } from './block/block.module';

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
    ScheduleModule.forRoot(),
    ConsumerModule,
    ProgramModule,
    MessageModule,
    MetadataModule,
    GearModule,
    HealthcheckModule,
    CodeModule,
    ProducerModule,
    TasksModule,
    BlockModule,
  ],
  controllers: [HealthcheckController],
})
export class AppModule {}
