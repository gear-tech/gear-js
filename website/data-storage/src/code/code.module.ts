import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CodeService } from './code.service';
import { Code } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Code])],
  controllers: [],
  providers: [CodeService],
  exports: [CodeService],
})
export class CodeModule {}
