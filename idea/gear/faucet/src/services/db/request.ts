import 'reflect-metadata';
import { FaucetLimitError, InvalidAddress, logger, UnsupportedTargetError } from 'gear-idea-common';
import { validateOrReject } from 'class-validator';
import { decodeAddress } from '@gear-js/api';
import { In, Repository } from 'typeorm';

import { AppDataSource, FaucetRequest, FaucetType, RequestStatus } from '../../database';
import { LastSeenService } from './last-seen';
import config from '../../config';

export class RequestService {
  private _repo: Repository<FaucetRequest>;
  private _targets: string[];

  constructor(
    private _varaTestnetGenesis: string,
    private _lastSeenService: LastSeenService,
  ) {
    this._repo = AppDataSource.getRepository(FaucetRequest);
    this._targets = config.eth.erc20Contracts.map(([contract]) => contract.toLowerCase());
    this._targets.push(_varaTestnetGenesis.toLowerCase());
    logger.info('Request service initialized');
  }

  public async newRequest(address: string, target: string) {
    target = target.toLowerCase();
    address = address.toLowerCase();
    if (!this._targets.includes(target)) {
      throw new UnsupportedTargetError(target);
    }

    const req = new FaucetRequest({
      address,
      target,
      type: target === this._varaTestnetGenesis ? FaucetType.VaraTestnet : FaucetType.VaraBridge,
      status: RequestStatus.Pending,
    });

    try {
      await validateOrReject(req);
    } catch (_) {
      throw new InvalidAddress();
    }

    if (req.type === FaucetType.VaraTestnet) {
      req.address = decodeAddress(address);
    }

    const isAllowed = await this._lastSeenService.isLastSeenMoreThan24Hours(req.address, target);

    if (!isAllowed) {
      throw new FaucetLimitError();
    }

    await this._repo.save(req);
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
    await this._repo.update({ status: RequestStatus.Processing }, { status: RequestStatus.Pending });
  }
}
