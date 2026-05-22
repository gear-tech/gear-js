import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { API_CONSTANTS } from './common/constants.js';
import { getDatabaseConfig } from './config/database.config.js';

// Feature modules
import { BatchesModule } from './modules/batches/batches.module.js';
import { CodesModule } from './modules/codes/codes.module.js';
import { LookupModule } from './modules/lookup/lookup.module.js';
import { MessagesModule } from './modules/messages/messages.module.js';
import { ProgramsModule } from './modules/programs/programs.module.js';
import { RepliesModule } from './modules/replies/replies.module.js';
import { StateTransitionsModule } from './modules/state-transitions/state-transitions.module.js';
import { TransactionsModule } from './modules/transactions/transactions.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot(getDatabaseConfig()),
    ThrottlerModule.forRoot([
      {
        ttl: API_CONSTANTS.RATE_LIMIT.TTL * 1000,
        limit: API_CONSTANTS.RATE_LIMIT.LIMIT,
      },
    ]),
    ProgramsModule,
    CodesModule,
    BatchesModule,
    StateTransitionsModule,
    MessagesModule,
    RepliesModule,
    TransactionsModule,
    LookupModule,
  ],
})
export class AppModule {}
