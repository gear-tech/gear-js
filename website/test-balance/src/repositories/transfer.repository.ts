import { TransferBalance } from '../database/entities/transfer.entity';
import { transferRepo } from '../database/db-create-connection';

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
