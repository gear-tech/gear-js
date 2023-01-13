import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StateService } from './state.service';
import { State } from '../database/entities';
import { ProgramModule } from '../program/program.module';
import { StateRepo } from './state.repo';
import { StateToCodeModule } from '../state-to-code/state-to-code.module';

@Module({
  imports: [
    ProgramModule,
    StateToCodeModule,
    TypeOrmModule.forFeature([State]),
  ],
  controllers: [],
  providers: [StateService, StateRepo],
  exports: [StateService, StateRepo]
})
export class StateModule {}
