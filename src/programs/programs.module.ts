import { Module } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { GearNodeModule } from 'src/gear-node/gear-node.module';

@Module({
  imports: [GearNodeModule],
  providers: [ProgramsService],
  exports: [ProgramsService],
})
export class ProgramsModule {}
