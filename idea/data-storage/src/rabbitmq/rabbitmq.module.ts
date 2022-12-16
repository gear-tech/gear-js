import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RabbitmqService } from './rabbitmq.service';
import { MetadataModule } from '../metadata/metadata.module';
import { ProgramModule } from '../program/program.module';
import { MessageModule } from '../message/message.module';
import { CodeModule } from '../code/code.module';
import { BlockModule } from '../block/block.module';

@Module({
  imports: [
    ConfigModule,
    MetadataModule,
    ProgramModule,
    MessageModule,
    CodeModule,
    BlockModule,
  ],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
