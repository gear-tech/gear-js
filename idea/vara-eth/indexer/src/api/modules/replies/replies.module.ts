import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyRequest, ReplySent } from '../../../model/index.js';
import { RepliesController } from './replies.controller.js';
import { RepliesService } from './replies.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ReplyRequest, ReplySent])],
  controllers: [RepliesController],
  providers: [RepliesService],
  exports: [RepliesService],
})
export class RepliesModule {}
