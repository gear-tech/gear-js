import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from 'src/programs/entities/program.entity';
import { Meta } from './entities/meta.entity';
import { MetadataService } from './metadata.service';

@Module({
  imports: [TypeOrmModule.forFeature([Program, Meta]), Meta],
  providers: [MetadataService],
})
export class MetadataModule {}
