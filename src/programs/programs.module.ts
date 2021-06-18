import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from './entities/program.entity';
import { ProgramsService } from './programs.service';
import { ProgramsController } from './programs.controller';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Program, User]), Program],
  providers: [ProgramsService],
  exports: [ProgramsService],
  controllers: [ProgramsController],
})
export class ProgramsModule {}
