import { CronJob } from 'cron';
import { logger } from 'gear-idea-common';

import { LastSeenService, RequestService } from '../db';
import { FaucetRequest, FaucetType } from '../../database';

export abstract class FaucetProcessor {
  private _job: CronJob<any, this>;
  constructor(
    private _lastSeenService: LastSeenService,
    private _requestService: RequestService,
  ) {}

  public abstract init(): Promise<void>;
  protected abstract get cronInterval(): string;
  protected abstract get type(): FaucetType;
  protected abstract handleRequests(requests: FaucetRequest[]): Promise<number[]>;

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
        try {
          completed.push(...(await this.handleRequests(requests)));
        } catch (error) {
          logger.error('Failed to handle requests', { reason: error.message, stack: error.stack });
          return;
        }

        await this._requestService.setCompleted(completed);
        await this._lastSeenService.updateLastSeen(requests.filter(({ id }) => completed.includes(id)));
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
        logger.error('Cron job failed', { error });
      },
    );
  }
}
