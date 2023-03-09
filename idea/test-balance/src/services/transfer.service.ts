import { plainToClass } from 'class-transformer';

import { TransferBalance } from '../database/entities/transfer.entity';
import { transferRepository } from '../database/repositories/transfer.repository';

const transferService = {
  async setTransferDate(account: string, genesis: string): Promise<TransferBalance> {
    const transferBalanceTypeDB = plainToClass(TransferBalance, {
      account: `${account}.${genesis}`,
      lastTransfer: new Date(),
    });

    return transferRepository.save(transferBalanceTypeDB);
  },

  async isPossibleToTransfer(account: string, genesis: string): Promise<boolean> {
    const transfer = await transferRepository.getByAccountAndGenesis(account, genesis);

    if (!transfer) {
      return true;
    }

    if (isLastTransferEarlierThanToday(transfer)) {
      return true;
    }
  },
};

function isLastTransferEarlierThanToday(transfer: TransferBalance): boolean {
  const HOURS = 0;
  const MIN = 0;
  const SEC = 0;
  const MS = 0;

  const now = new Date().setHours(HOURS, MIN, SEC, MS);

  return transfer.lastTransfer.setHours(HOURS, MIN, SEC, MS) < now;
}

export { transferService };
