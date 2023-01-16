import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RabbitmqService } from './rabbitmq.service';
import { MetaModule } from '../meta/meta.module';
import { ProgramModule } from '../program/program.module';
import { MessageModule } from '../message/message.module';
import { CodeModule } from '../code/code.module';
import { BlockModule } from '../block/block.module';
import { StateModule } from '../state/state.module';
import { StateToCodeModule } from '../state-to-code/state-to-code.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => MetaModule),
    ProgramModule,
    MessageModule,
    CodeModule,
    BlockModule,
    StateModule,
    StateToCodeModule,
  ],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
