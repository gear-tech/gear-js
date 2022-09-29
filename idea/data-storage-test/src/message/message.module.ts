import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from '../database/entities/message.entity';
import { MessageService } from './message.service';
import { MessageRepo } from './message.repo';
import { ProgramModule } from '../program/program.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ProgramModule],
  providers: [MessageService, MessageRepo],
  exports: [MessageService, MessageRepo],
})
export class MessageModule {}
