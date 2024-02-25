import { DataSource, Repository } from 'typeorm';

import { Status } from '../database';
import config from '../config';

export class StatusService {
  private repo: Repository<Status>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Status);
  }

  async init(genesis: string) {
    if (!(await this.repo.findOneBy({ genesis }))) {
      await this.repo.save(new Status({ genesis, height: config.indexer.fromBlock.toString() }));
    }
  }

  public getStatus(genesis: string): Promise<Status> {
    return this.repo.findOneBy({
      genesis,
    });
  }

  public async update(genesis: string, height: string) {
    return this.repo.update({ genesis }, { height });
  }
}
