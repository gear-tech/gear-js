import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Program } from '../database/entities/program.entity';
import { ProgramService } from './program.service';
import { ProgramRepo } from './program.repo';

@Module({
  imports: [TypeOrmModule.forFeature([Program])],
  providers: [ProgramService, ProgramRepo],
  exports: [ProgramService, ProgramRepo],
})
export class ProgramModule {}
