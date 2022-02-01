import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from '../entities/program.entity';
import { ProgramsService } from './programs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Program]), Program],
  providers: [ProgramsService],
  exports: [ProgramsService],
})
export class ProgramsModule {}
