import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ProducerModule } from '../producer/producer.module';

@Module({
  imports: [ProducerModule],
  providers: [TasksService]
})
export class TasksModule {}
