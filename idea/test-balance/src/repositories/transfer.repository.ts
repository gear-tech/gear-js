import { AppDataSource } from '../database/app-data-source';
import { TransferBalance } from '../database/entities/transfer.entity';

const transferBalanceRepo = AppDataSource.getRepository(TransferBalance);

const transferRepository = {
  async save(transferBalance: TransferBalance): Promise<TransferBalance> {
    return transferBalanceRepo.save(transferBalance);
  },
  async getByAccountAndGenesis(account: string, genesis: string): Promise<TransferBalance> {
    const searchProperty = `${account}.${genesis}`;
    return transferBalanceRepo.findOne({
      where: {
        account: searchProperty,
      },
    });
  },
};

export { transferRepository };
