import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProgramModule } from 'src/program/program.module';
import { MetadataService } from './metadata.service';
import { MetadataRepo } from './metadata.repo';
import { Meta } from '../entities';

@Module({
  imports: [ProgramModule, TypeOrmModule.forFeature([Meta])],
  providers: [MetadataService, MetadataRepo],
  exports: [MetadataService, MetadataRepo],
})
export class MetadataModule {}
