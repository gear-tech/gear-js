import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MetadataService } from './metadata.service';
import { MetadataRepo } from './metadata.repo';
import { Meta } from '../database/entities';
import { ProgramModule } from '../program/program.module';

@Module({
  imports: [ProgramModule, TypeOrmModule.forFeature([Meta])],
  providers: [MetadataService, MetadataRepo],
  exports: [MetadataService, MetadataRepo],
})
export class MetadataModule {}
