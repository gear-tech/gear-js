import { getRepository, Repository } from 'typeorm';

import { TransferBalance } from '../database/entities/transfer.entity';

const transferRepo: Repository<TransferBalance> = getRepository(TransferBalance);

const transferRepository = {
  async save(transferBalance: TransferBalance): Promise<TransferBalance> {
    return transferRepo.save(transferBalance);
  },
  async getByAccountAndGenesis(account: string, genesis: string): Promise<TransferBalance> {
    const searchProperty = `${account}.${genesis}`;
    return transferRepo.findOne({
      where: {
        account: searchProperty,
      },
    });
  },
};

export { transferRepository };
