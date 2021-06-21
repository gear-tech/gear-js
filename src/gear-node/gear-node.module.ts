import { Module } from '@nestjs/common';
import { ProgramsModule } from 'src/programs/programs.module';
import { UsersModule } from 'src/users/users.module';
import { GearNodeService } from './gear-node.service';
import { GearNodeController } from './gear-node.controller';

@Module({
  imports: [UsersModule, ProgramsModule],
  providers: [GearNodeService],
  exports: [GearNodeService],
  controllers: [GearNodeController],
})
export class GearNodeModule {}
