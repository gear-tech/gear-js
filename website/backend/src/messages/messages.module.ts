import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from 'src/programs/entities/program.entity';
import { ProgramsModule } from 'src/programs/programs.module';
import { User } from 'src/telegram/decorators';
import { UsersModule } from 'src/users/users.module';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    Message,
    UsersModule,
    ProgramsModule,
  ],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
