import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramsModule } from 'sample-polkadotjs-typegen/programs/programs.module';
import { User } from 'sample-polkadotjs-typegen/users/entities/user.entity';
import { UsersModule } from 'sample-polkadotjs-typegen/users/users.module';
import { NodeEvent } from './entities/event.entity';
import { EventsService } from './events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NodeEvent, User]),
    NodeEvent,
    UsersModule,
    ProgramsModule,
  ],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
