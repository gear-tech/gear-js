import { And, DataSource, In, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { Block } from '../database';

export class BlockService {
  private repo: Repository<Block>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Block);
  }

  public async getLastBlock({ genesis }: { genesis: string }): Promise<Block> {
    const [block] = await this.repo.find({
      where: {
        genesis,
      },
      order: {
        timestamp: 'DESC',
      },
      take: 1,
    });

    return block;
  }

  public async save(blocks: Block[]): Promise<Block[]> {
    return this.repo.save(blocks);
  }

  public async getSyncedBlockNumbers(from: number, to: number, genesis: string) {
    let startBlock = await this.repo.findOneBy({ genesis, number: from.toString() });
    if (!startBlock) {
      startBlock = await this.repo.findOne({ where: { genesis }, order: { timestamp: 'ASC' } });
    }

    let endBlock = await this.repo.findOneBy({ genesis, number: to.toString() });
    if (!endBlock) {
      endBlock = await this.repo.findOne({ where: { genesis }, order: { timestamp: 'DESC' } });
    }

    if (!startBlock || !endBlock) {
      return [];
    }

    const syncedBlocks = await this.repo.find({
      where: {
        timestamp: And(MoreThanOrEqual(startBlock.timestamp), LessThanOrEqual(endBlock.timestamp)),
        genesis,
      },
      select: ['number'],
      order: {
        timestamp: 'ASC',
      },
    });

    return syncedBlocks.map(({ number }) => Number(number));
  }

  async getNotSynced(numbers: number[]) {
    const blocks = await this.repo.find({
      where: { number: In(numbers.map((v) => v + '')) },
      select: { number: true },
    });

    const syncedNumbers = blocks.map((block) => Number(block.number));

    return numbers.filter((number) => !syncedNumbers.includes(number)).sort((a, b) => a - b);
  }
}
