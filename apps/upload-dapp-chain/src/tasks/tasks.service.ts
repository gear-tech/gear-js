import { Injectable, Logger } from "@nestjs/common";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";

import { updateWasmUrlsByLastReleasesRepo } from "../common/helpers";

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {}

  // every 24 hours
  @Cron("0 */24 * * *", {
    name: "updateWasmUrlsCron",
  })
  async updateWasmUrlsCron() {
    try {
      await updateWasmUrlsByLastReleasesRepo();
    } catch (error) {
      this.logger.error("Update wasm urls in yaml file error");
      console.log(error);
      const job = this.schedulerRegistry.getCronJob("updateWasmUrlsCron");

      job.stop();
      console.log(job.lastDate());
    }
  }
}
