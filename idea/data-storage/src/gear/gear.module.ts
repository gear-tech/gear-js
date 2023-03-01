import { Module } from '@nestjs/common';

import { GearService } from './gear.service';
import { ProgramModule } from '../program/program.module';
import { MessageModule } from '../message/message.module';
import { CodeModule } from '../code/code.module';
import { BlockModule } from '../block/block.module';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { MetaModule } from '../meta/meta.module';

@Module({
  imports: [ProgramModule, MessageModule, MetaModule, CodeModule, BlockModule, RabbitmqModule],
  providers: [GearService],
  exports: [GearService],
})
export class GearModule {}
