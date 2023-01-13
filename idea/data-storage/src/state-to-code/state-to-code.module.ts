import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StateToCode } from '../database/entities';
import { StateToCodeRepo } from './state-to-code.repo';
import { StateToCodeService } from './state-to-code.service';

@Module({
  imports: [TypeOrmModule.forFeature([StateToCode])],
  controllers: [],
  providers: [StateToCodeService, StateToCodeRepo],
  exports: [StateToCodeService]
})
export class StateToCodeModule {}
