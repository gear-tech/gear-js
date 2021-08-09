import { Module } from '@nestjs/common';
import { EventsModule } from 'sample-polkadotjs-typegen/events/events.module';
import { ProgramsModule } from 'src/programs/programs.module';
import { UsersModule } from 'src/users/users.module';
import { GearNodeService } from './gear-node.service';

@Module({
  imports: [UsersModule, ProgramsModule, EventsModule],
  providers: [GearNodeService],
  exports: [GearNodeService],
})
export class GearNodeModule {}
