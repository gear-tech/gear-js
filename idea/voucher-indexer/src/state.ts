import { Store } from '@subsquid/typeorm-store';
import { Voucher } from './model';
import { Block } from './processor';
import {
  BalanceTransferArgs,
  IssueVoucherTxArgs,
  UpdateVoucherTxArgs,
  VoucherIssuedArgs,
  VoucherUpdatedArgs,
} from './types';
import { logger } from '@gear-js/common';
import { In } from 'typeorm';

export class BatchState {
  private _vouchers: Map<string, Voucher>;
  private _revoked: Set<string>;
  private _store: Store;
  private _transfers: Map<string, bigint>;

  constructor() {
    this._vouchers = new Map();
    this._revoked = new Set();
    this._transfers = new Map();
  }

  public new(store: Store) {
    this._vouchers.clear();
    this._revoked.clear();
    this._transfers.clear();
    this._store = store;
  }

  public issued(event: VoucherIssuedArgs, tx: IssueVoucherTxArgs, block: Block) {
    logger.info(`Voucher issued`, { id: event.voucherId, block: block.height });
    const balance = BigInt(tx.balance);
    const atBlock = BigInt(block.height);
    const atTime = new Date(block.timestamp!);

    this._vouchers.set(
      event.voucherId,
      new Voucher({
        id: event.voucherId,
        owner: event.owner,
        spender: event.spender,
        amount: balance,
        balance: BigInt(0), // it will be set by transfer event
        programs: tx.programs,
        codeUploading: tx.codeUploading,
        expiryAtBlock: atBlock + BigInt(tx.duration),
        expiryAt: new Date(block.timestamp! + tx.duration * 3000),
        issuedAtBlock: atBlock,
        issuedAt: atTime,
        updatedAtBlock: atBlock,
        updatedAt: atTime,
      }),
    );
  }

  public async updated(event: VoucherUpdatedArgs, tx: UpdateVoucherTxArgs, block: Block) {
    logger.info(`Voucher updated`, { id: event.voucherId, block: block.height });
    const atBlock = BigInt(block.height);
    const atTime = new Date(block.timestamp!);

    const voucher = await this._getVoucher(event.voucherId);

    if (!voucher) {
      return;
    }

    voucher.updatedAtBlock = atBlock;
    voucher.updatedAt = atTime;

    if (tx.moveOwnership) {
      voucher.owner = tx.moveOwnership;
    }

    if (tx.balanceTopUp) {
      voucher.amount = BigInt(voucher.amount) + BigInt(tx.balanceTopUp);
    }

    if (tx.appendPrograms.__kind === 'Some') {
      voucher.programs!.push(...tx.appendPrograms.value);
    }

    if (tx.codeUploading) {
      voucher.codeUploading = tx.codeUploading;
    }

    if (tx.prolongDuration) {
      voucher.expiryAtBlock = atBlock + BigInt(tx.prolongDuration);
      voucher.expiryAt = new Date(block.timestamp! + tx.prolongDuration * 3000);
    }
  }

  public async declined(event: VoucherUpdatedArgs, block: Block) {
    logger.info(`Voucher declined`, { id: event.voucherId, block: block.height });
    const voucher = await this._getVoucher(event.voucherId);

    if (!voucher) {
      return;
    }

    voucher.isDeclined = true;
  }

  public async revoked(event: VoucherUpdatedArgs, block: Block) {
    logger.info(`Voucher revoked`, { id: event.voucherId, block: block.height });

    this._revoked.add(event.voucherId);
  }

  public transfer(event: BalanceTransferArgs) {
    const fromBalance = this._transfers.has(event.from) ? this._transfers.get(event.from)! : BigInt(0);
    const toBalance = this._transfers.has(event.to) ? this._transfers.get(event.to)! : BigInt(0);

    this._transfers.set(event.from, fromBalance - BigInt(event.amount));
    this._transfers.set(event.to, toBalance + BigInt(event.amount));
  }

  private async _getVoucher(id: string): Promise<Voucher | null> {
    if (this._vouchers.has(id)) {
      return this._vouchers.get(id)!;
    }

    const voucher = await this._store.findOneBy(Voucher, { id });

    if (!voucher) {
      return null;
    }

    voucher.balance = BigInt(voucher.balance);

    this._vouchers.set(id, voucher);

    return voucher;
  }

  async save() {
    if (this._vouchers.size > 0) {
      const voucherIds = Array.from(this._vouchers.keys());

      for (const id of voucherIds) {
        if (this._transfers.has(id)) {
          this._vouchers.get(id)!.balance += this._transfers.get(id)!;
          this._transfers.delete(id);
        }
        if (this._revoked.has(id)) {
          this._vouchers.delete(id);
          this._revoked.delete(id);
        }
      }

      const vouchers = Array.from(this._vouchers.values());
      await this._store.upsert(vouchers);
      logger.info(`Vouchers saved`, { size: this._vouchers.size });
    }

    if (this._revoked.size > 0) {
      const revoked = Array.from(this._revoked);
      await this._store.remove(Voucher, revoked);
      logger.info(`Vouchers removed`, { size: this._revoked.size });
    }

    const trasnferIds = Array.from(this._transfers.keys());
    if (trasnferIds.length > 0) {
      const voucherTransfers = await this._store.find(Voucher, { where: { id: In(trasnferIds) } });

      if (voucherTransfers.length > 0) {
        for (const voucher of voucherTransfers) {
          const balance = this._transfers.get(voucher.id)!;
          voucher.balance = BigInt(voucher.balance) + balance;
        }

        await this._store.upsert(voucherTransfers);
        logger.info(`Transfers saved`, { size: voucherTransfers.length });
      }
    }
  }
}
