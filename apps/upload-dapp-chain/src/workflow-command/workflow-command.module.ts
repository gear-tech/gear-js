import { Module } from "@nestjs/common";

import { WorkflowCommandService } from "./workflow-command.service";

@Module({
  controllers: [],
  providers: [WorkflowCommandService],
  exports: [WorkflowCommandService],
})
export class WorkflowCommandModule {}
