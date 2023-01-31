import { forwardRef, Module } from '@nestjs/common';

import { GearEventListener } from './gear-event-listener';
import { ProgramModule } from '../program/program.module';
import { MessageModule } from '../message/message.module';
import { CodeModule } from '../code/code.module';
import { BlockModule } from '../block/block.module';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { MetaModule } from '../meta/meta.module';


@Module({
  imports: [
    ProgramModule,
    MessageModule,
    forwardRef(() => MetaModule),
    CodeModule,
    BlockModule,
    RabbitmqModule,
  ],
  providers: [GearEventListener],
  exports: [GearEventListener],
})
export class GearModule {}
