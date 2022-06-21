import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProgramsModule } from 'src/programs/programs.module';
import { Meta } from '../entities/meta.entity';
import { MetadataService } from './metadata.service';
import { Program } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Program, Meta]), Meta, ProgramsModule],
  providers: [MetadataService],
  exports: [MetadataService],
})
export class MetadataModule {}
