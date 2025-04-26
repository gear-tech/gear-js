import 'reflect-metadata';
import { In, Repository } from 'typeorm';
import { FaucetLimitError, InvalidAddress, logger, UnsupportedTargetError } from 'gear-idea-common';

import { AppDataSource, FaucetRequest, FaucetType, RequestStatus } from '../../database';
import config from '../../config';
import { LastSeenService } from './last-seen';
import { validateOrReject } from 'class-validator';

export class RequestService {
  private _repo: Repository<FaucetRequest>;
  private _lastSeenService: LastSeenService;
  private _targets: string[];

  constructor(private _varaTestnetGenesis: string) {
    this._repo = AppDataSource.getRepository(FaucetRequest);
    this._lastSeenService = new LastSeenService();
    this._targets = config.eth.erc20Contracts.map(([contract]) => contract.toLowerCase());
    this._targets.push(_varaTestnetGenesis.toLowerCase());
    logger.info('Request service initialized');
  }

  public async newRequest(address: string, target: string) {
    if (!this._targets.includes(target.toLowerCase())) {
      throw new UnsupportedTargetError(target);
    }

    if (!(await this._lastSeenService.isLastSeenMoreThan24Hours(address, target))) {
      throw new FaucetLimitError();
    }

    const req = new FaucetRequest({
      address,
      target,
      type: target === this._varaTestnetGenesis ? FaucetType.VaraTestnet : FaucetType.VaraBridge,
    });

    try {
      await validateOrReject(req);
    } catch (error) {
      throw new InvalidAddress();
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

  public async setCompleted(id: number | number[]) {
    await this._repo.update({ id: In(Array.isArray(id) ? id : [id]) }, { status: RequestStatus.Completed });
  }

  public async resetProcessing() {
    await this._repo.update({ status: RequestStatus.Processing }, { status: RequestStatus.Pending });
  }
}
