import { Repository } from 'typeorm';
import * as crypto from 'node:crypto';

import { AppDataSource, UserLastSeen } from '../../database';
import { logger } from 'gear-idea-common';

const $24_HOURS = 24 * 60 * 60 * 1000;

export function hash(address: string, target: string) {
  return crypto
    .createHash('sha256')
    .update(address + target)
    .digest('hex');
}

export class LastSeenService {
  private _repo: Repository<UserLastSeen>;

  constructor() {
    this._repo = AppDataSource.getRepository(UserLastSeen);
    logger.info('LastSeen service initialized');
  }

  public async updateLastSeen(items: { address: string; target: string }[]) {
    await this._repo.save(items.map(({ address, target }) => new UserLastSeen(hash(address, target))));
  }

  public async isLastSeenMoreThan24Hours(address: string, target: string) {
    const lastSeen = await this._repo.findOne({ where: { id: hash(address, target) } });

    if (!lastSeen) return true;

    const now = new Date();
    const diff = now.getTime() - lastSeen.timestamp.getTime();

    return diff > $24_HOURS;
  }
}
