import 'reflect-metadata';
import { FaucetLimitError, InvalidAddress, logger, UnsupportedTargetError } from 'gear-idea-common';
import { validateOrReject } from 'class-validator';
import { decodeAddress } from '@gear-js/api';
import { In, Repository } from 'typeorm';

import { AppDataSource, FaucetRequest, FaucetType, RequestStatus } from '../../database';
import { hash, LastSeenService } from './last-seen';
import config from '../../config';

export class RequestService {
  private _repo: Repository<FaucetRequest>;
  private _targets: string[];
  private _requesting: Set<string>;

  constructor(
    private _varaTestnetGenesis: string,
    private _lastSeenService: LastSeenService,
  ) {
    this._repo = AppDataSource.getRepository(FaucetRequest);
    this._targets = config.eth.erc20Contracts.map(([contract]) => contract.toLowerCase());
    this._targets.push(_varaTestnetGenesis.toLowerCase());
    this._requesting = new Set<string>();
    logger.info('Request service initialized');
  }

  private _validateTarget(value: string): string {
    const target = value.toLowerCase();

    if (!this._targets.includes(target)) {
      throw new UnsupportedTargetError(target);
    }

    return target;
  }

  private async _createAndValidateRequest(address, target): Promise<FaucetRequest> {
    const req = new FaucetRequest({
      address,
      target,
      type: target === this._varaTestnetGenesis ? FaucetType.VaraTestnet : FaucetType.VaraBridge,
      status: RequestStatus.Pending,
    });

    if (req.type === FaucetType.VaraBridge) {
      req.address = req.address.toLowerCase();
    }

    try {
      await validateOrReject(req);
    } catch (_) {
      throw new InvalidAddress();
    }

    if (req.type === FaucetType.VaraTestnet) {
      req.address = decodeAddress(address);
    }

    return req;
  }

  private _checkLimits(req: FaucetRequest, rhash: string) {
    if (this._requesting.has(rhash)) {
      throw new FaucetLimitError();
    }

    this._requesting.add(rhash);

    const isLastSeenMoreThan24Hours = this._lastSeenService.isLastSeenMoreThan24Hours(req.address, req.target);
    const requestsQueue = this._repo.findBy({
      address: req.address,
      target: req.target,
      status: In([RequestStatus.Pending, RequestStatus.Processing]),
    });

    return Promise.all([isLastSeenMoreThan24Hours, requestsQueue]);
  }

  public async newRequest(address: string, target: string) {
    target = this._validateTarget(target);

    const req = await this._createAndValidateRequest(address, target);

    const rhash = hash(req.address, target);

    if (this._requesting.has(rhash)) {
      throw new FaucetLimitError();
    }
    this._requesting.add(rhash);

    try {
      const [isLastSeenMoreThan24Hours, requestsQueue] = await Promise.all([
        this._lastSeenService.isLastSeenMoreThan24Hours(req.address, target),
        this._repo.findBy({ address, target, status: In([RequestStatus.Pending, RequestStatus.Processing]) }),
      ]);

      const isAllowed = isLastSeenMoreThan24Hours && requestsQueue.length === 0;

      if (!isAllowed) {
        throw new FaucetLimitError();
      }

      await this._repo.save(req);
    } finally {
      this._requesting.delete(rhash);
    }
  }

  public async getRequestsToProcess(type: FaucetType) {
    const requests = await this._repo.find({
      where: { type, status: RequestStatus.Pending },
      order: { timestamp: 'DESC' },
    });

    await this._repo.update({ id: In(requests.map(({ id }) => id)) }, { status: RequestStatus.Processing });

    return requests;
  }

  public async setCompleted(ids: number[]) {
    if (ids.length > 0) {
      await this._repo.update({ id: In(ids) }, { status: RequestStatus.Completed });
      logger.debug(`Requests ${ids} marked as completed`);
    }
  }

  public async setFailed(ids: number[]) {
    if (ids.length > 0) {
      await this._repo.update({ id: In(ids) }, { status: RequestStatus.Failed });
      logger.debug(`Requests ${ids} marked as failed`);
    }
  }

  public async resetProcessing() {
    await this._repo.update({ status: RequestStatus.Processing }, { status: RequestStatus.Failed });
  }
}
