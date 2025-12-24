import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashRegistry } from '../../../model/index.js';
import { LookupController } from './lookup.controller.js';
import { LookupService } from './lookup.service.js';
import { BatchesModule } from '../batches/batches.module.js';
import { CodesModule } from '../codes/codes.module.js';
import { MessagesModule } from '../messages/messages.module.js';
import { ProgramsModule } from '../programs/programs.module.js';
import { RepliesModule } from '../replies/replies.module.js';
import { StateTransitionsModule } from '../state-transitions/state-transitions.module.js';
import { TransactionsModule } from '../transactions/transactions.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([HashRegistry]),
    BatchesModule,
    CodesModule,
    MessagesModule,
    ProgramsModule,
    RepliesModule,
    StateTransitionsModule,
    TransactionsModule,
  ],
  controllers: [LookupController],
  providers: [LookupService],
})
export class LookupModule {}
