import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectedTransaction } from '@vara-eth/idea-indexer-db';

import { InjectedTransactionsController } from './injected-transactions.controller.js';
import { InjectedTransactionsService } from './injected-transactions.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([InjectedTransaction])],
  controllers: [InjectedTransactionsController],
  providers: [InjectedTransactionsService],
  exports: [InjectedTransactionsService],
})
export class InjectedTransactionsModule {}
