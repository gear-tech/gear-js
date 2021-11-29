import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransferBalance } from './transfer.entity';

@Injectable()
export class DbService {
  constructor(
    @InjectRepository(TransferBalance)
    private readonly repo: Repository<TransferBalance>,
  ) {}
  async possibleToTransfer(account: string) {
    const transfer = await this.repo.findOne({ account });
    if (!transfer) {
      return true;
    }
    if (
      transfer.lastTransfer.setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0)
    ) {
      return true;
    }
    return false;
  }

  async setTransferDate(account: string) {
    const transfer = this.repo.create({
      account,
      lastTransfer: new Date(),
    });
    return await this.repo.save(transfer);
  }
}
