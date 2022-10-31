import { Module } from "@nestjs/common";

import { TasksService } from "./tasks.service";

@Module({
  controllers: [],
  providers: [TasksService],
  exports: [],
})
export class TasksModule {}
