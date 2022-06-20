import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from '../entities/message.entity';
import { MessageService } from './message.service';
import { MessageRepo } from './message.repo';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessageService, MessageRepo],
  exports: [MessageService, MessageRepo],
})
export class MessageModule {}
