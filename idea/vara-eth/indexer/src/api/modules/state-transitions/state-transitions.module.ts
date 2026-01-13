import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateTransition } from '../../../model/index.js';
import { StateTransitionsController } from './state-transitions.controller.js';
import { StateTransitionsService } from './state-transitions.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([StateTransition])],
  controllers: [StateTransitionsController],
  providers: [StateTransitionsService],
  exports: [StateTransitionsService],
})
export class StateTransitionsModule {}
