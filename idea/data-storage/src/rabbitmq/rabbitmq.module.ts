import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RabbitmqService } from './rabbitmq.service';
import { MetaModule } from '../meta/meta.module';
import { ProgramModule } from '../program/program.module';
import { MessageModule } from '../message/message.module';
import { CodeModule } from '../code/code.module';
import { BlockModule } from '../block/block.module';
import { StateModule } from '../state/state.module';

@Module({
  imports: [
    ConfigModule,
    MetaModule,
    ProgramModule,
    MessageModule,
    CodeModule,
    BlockModule,
    StateModule
  ],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
