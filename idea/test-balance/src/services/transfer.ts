import { JSONRPC_ERRORS, logger } from '@gear-js/common';
import { Repository } from 'typeorm';

import { AppDataSource, TransferBalance } from '../database';
import { validateAddress } from '../utils';
import { GearService } from './gear';

interface ResponseTransferBalance {
  status?: string;
  transferredBalance?: string;
  error?: string;
}

export class TransferService {
  private repo: Repository<TransferBalance>;

  constructor(private gearService: GearService) {
    this.repo = AppDataSource.getRepository(TransferBalance);
  }

  async setTransferDate(account: string, genesis: string): Promise<TransferBalance> {
    const record = new TransferBalance({
      account: `${account}.${genesis}`,
      lastTransfer: new Date(),
    });

    return this.repo.save(record);
  }

  async isPossibleToTransfer(account: string, genesis: string): Promise<boolean> {
    const transfer = await this.repo.findOneBy({ account: `${account}.${genesis}` });

    if (!transfer) {
      return true;
    }

    return isLastTransferEarlierThanToday(transfer);
  }

  async transferBalance(
    { address, genesis }: { address: string; genesis: string },
    correlationId: string,
  ): Promise<ResponseTransferBalance> {
    let addr: string;
    try {
      addr = validateAddress(address);
    } catch (err) {
      logger.error('Invalid address', { address, correlationId });
      return { error: JSONRPC_ERRORS.InvalidAddress.name };
    }

    const isAllowed = await this.isPossibleToTransfer(addr, genesis);

    if (!isAllowed) {
      logger.info(`Transfer limit reached`, { addr, correlationId });
      return { error: JSONRPC_ERRORS.TransferLimitReached.name };
    }

    try {
      const result = await new Promise<string>((resolve, reject) =>
        this.gearService.requestBalance(addr, correlationId, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }),
      );
      await this.setTransferDate(addr, this.gearService.genesisHash);
      return { status: 'ok', transferredBalance: result };
    } catch (error) {
      logger.error('Transfer balance error', { error: error.message, stack: error.stack, correlationId });
      return { error: JSONRPC_ERRORS.InternalError.name };
    }
  }
}

function isLastTransferEarlierThanToday(transfer: TransferBalance): boolean {
  const now = new Date().setHours(0, 0, 0, 0);

  return transfer.lastTransfer.setHours(0, 0, 0, 0) < now;
}
