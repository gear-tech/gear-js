import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StateService } from './state.service';
import { State } from '../database/entities';
import { ProgramModule } from '../program/program.module';
import { StateRepo } from './state.repo';

@Module({
  imports: [ProgramModule, TypeOrmModule.forFeature([State])],
  controllers: [],
  providers: [StateService, StateRepo],
  exports: [StateService, StateRepo]
})
export class StateModule {}
