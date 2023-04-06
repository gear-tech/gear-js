import { DataSource, Repository } from 'typeorm';

import { Status } from '../database/entities';

export class StatusService {
  private repo: Repository<Status>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Status);
  }

  public getStatus(genesis: string): Promise<Status> {
    return this.repo.findOneBy({
      genesis,
    });
  }

  public async update(genesis: string, height: string, hash: string) {
    let status = await this.repo.findOneBy({ genesis });
    if (!status) {
      status = { height, hash, genesis };
    } else {
      status.hash = hash;
      status.height = height;
    }

    return this.repo.save(status);
  }
}
