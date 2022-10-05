import { Injectable, Logger } from "@nestjs/common";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";

import { updateProgramDataByReleaseRepo } from "../common/helpers";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  // every 24 hours
  @Cron("0 */24 * * *", {
    name: "updateWorkflowProgramsDataCron",
  })
  async updateWorkflowProgramsDataCron() {
    try {
      await updateProgramDataByReleaseRepo();
    } catch (error) {
      this.logger.error("_________CRON_WORKFLOW_PROGRAMS_DATA_ERROR_________");
      console.log(error);
      const job = this.schedulerRegistry.getCronJob("updateWorkflowProgramsDataCron");

      job.stop();
      console.log(job.lastDate());
    }
  }
}
