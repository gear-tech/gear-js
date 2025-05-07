import { CronJob } from 'cron';

import { LastSeenService, RequestService } from '../db';
import { FaucetRequest, FaucetType } from '../../database';
import { Logger } from 'winston';

export abstract class FaucetProcessor {
  private _job: CronJob<any, this>;
  private logger: Logger;

  constructor(
    private _lastSeenService: LastSeenService,
    private _requestService: RequestService,
  ) {}

  public abstract init(): Promise<void>;
  protected abstract get cronInterval(): string;
  protected abstract get type(): FaucetType;
  protected abstract handleRequests(requests: FaucetRequest[]): Promise<{ success: number[]; fail: number[] }>;
  protected setLogger(logger: Logger) {
    this.logger = logger;
  }

  stop() {
    this._job.stop();
  }

  run() {
    this._job = new CronJob(
      this.cronInterval,
      async () => {
        const requests = await this._requestService.getRequestsToProcess(this.type);
        if (requests.length === 0) {
          return;
        }

        const completed = [];
        const failed = [];
        try {
          const { success, fail } = await this.handleRequests(requests);
          completed.push(...success);
          failed.push(...fail);
        } catch (error) {
          this.logger.error('Failed to handle requests', { reason: error.message, stack: error.stack });
          return;
        }

        await Promise.all([
          this._requestService.setCompleted(completed),
          this._requestService.setFailed(failed),
          this._lastSeenService.updateLastSeen(requests.filter(({ id }) => completed.includes(id))),
        ]);
      },
      null,
      true,
      null,
      this,
      false,
      null,
      null,
      true,
      (error) => {
        this.logger.error('Cron job failed', { error });
      },
    );
  }
}
