import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CodeService } from './code.service';
import { Code } from '../database/entities';
import { CodeRepo } from './code.repo';

@Module({
  imports: [TypeOrmModule.forFeature([Code])],
  controllers: [],
  providers: [CodeService, CodeRepo],
  exports: [CodeService, CodeRepo],
})
export class CodeModule {}
