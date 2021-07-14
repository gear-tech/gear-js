import { Module } from '@nestjs/common';
import { ProgramsModule } from 'src/programs/programs.module';
import { UsersModule } from 'src/users/users.module';
import { GearNodeService } from './gear-node.service';

@Module({
  imports: [UsersModule, ProgramsModule],
  providers: [GearNodeService],
  exports: [GearNodeService],
})
export class GearNodeModule {}
