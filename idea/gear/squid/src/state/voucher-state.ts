import type { Store } from '@subsquid/typeorm-store';
import { In, MoreThanOrEqual } from 'typeorm';

import { Voucher } from '../model/index.js';
import type { ProcessorContext } from '../processor.js';

export class VoucherState {
  private _vouchers: Map<string, Voucher>;
  private _transfers: Map<string, bigint>;
  private _revokedVouchers: Set<string>;
  private _declinedVouchers: Set<string>;
  private _voucherUpdateQueue: Map<string, Array<(v: Voucher) => void>>;
  private _activeVoucherIds: Map<string, bigint> | null; // id → expiryAtBlock; null = not yet loaded
  private _ctx: ProcessorContext<Store>;

  constructor() {
    this._vouchers = new Map();
    this._transfers = new Map();
    this._revokedVouchers = new Set();
    this._declinedVouchers = new Set();
    this._voucherUpdateQueue = new Map();
    this._activeVoucherIds = null;
  }

  async newBatch(ctx: ProcessorContext<Store>) {
    this._ctx = ctx;
    this._vouchers.clear();
    this._transfers.clear();
    this._revokedVouchers.clear();
    this._declinedVouchers.clear();
    this._voucherUpdateQueue.clear();

    if (this._activeVoucherIds === null) {
      const rows = await ctx.store.find(Voucher, {
        where: { isDeclined: false, expiryAtBlock: MoreThanOrEqual(BigInt(ctx.blocks[0].header.height)) },
      });
      this._activeVoucherIds = new Map(rows.map((v) => [v.id, v.expiryAtBlock]));
    }

    const currentBlock = BigInt(ctx.blocks[0].header.height);
    for (const [id, expiryAtBlock] of this._activeVoucherIds) {
      if (expiryAtBlock <= currentBlock) this._activeVoucherIds.delete(id);
    }
  }

  async save() {
    await this._updateDeclinedVoucher();
    await this._applyVoucherUpdates();
    await this._saveVouchers();
  }

  addVoucher(voucher: Voucher) {
    this._ctx.log.debug({ id: voucher.id, owner: voucher.owner, amount: voucher.amount }, 'addVoucher');
    this._vouchers.set(voucher.id, voucher);
    this._activeVoucherIds?.set(voucher.id, voucher.expiryAtBlock);
  }

  setTransfer(id: string, amount: bigint) {
    if (!this._activeVoucherIds?.has(id) && !this._vouchers.has(id)) return;
    this._ctx.log.debug({ id, amount: amount.toString() }, 'setVoucherTransfer');
    this._transfers.set(id, (this._transfers.get(id) ?? 0n) + amount);
  }

  queueVoucherUpdate(id: string, updater: (v: Voucher) => void) {
    this._ctx.log.debug({ id }, 'queueVoucherUpdate');
    const queue = this._voucherUpdateQueue.get(id) ?? [];
    queue.push(updater);
    this._voucherUpdateQueue.set(id, queue);
  }

  setVoucherDeclined(id: string) {
    this._ctx.log.debug({ id }, 'setVoucherDeclined');
    this._declinedVouchers.add(id);
    this._activeVoucherIds?.delete(id);
  }

  setVoucherRevoked(id: string) {
    this._ctx.log.debug({ id }, 'setVoucherRevoked');
    this._revokedVouchers.add(id);
    this._activeVoucherIds?.delete(id);
  }

  private async _queryVouchers(ids: string[]) {
    const vouchersToQuery = ids.filter((id) => !this._vouchers.has(id));
    if (vouchersToQuery.length > 0) {
      const vouchers = await this._ctx.store.find(Voucher, { where: { id: In(vouchersToQuery) } });
      for (const voucher of vouchers) {
        this._vouchers.set(voucher.id, voucher);
      }
    }
  }

  private async _updateDeclinedVoucher() {
    const ids = Array.from(this._declinedVouchers.keys());
    await this._queryVouchers(ids);

    for (const id of ids) {
      const voucher = this._vouchers.get(id);
      if (!voucher) {
        this._ctx.log.error(`setVoucherDeclined :: Voucher ${id} not found`);
        continue;
      }
      voucher.isDeclined = true;
      this._declinedVouchers.delete(id);
    }
  }

  private async _applyVoucherUpdates() {
    if (this._voucherUpdateQueue.size === 0) return;
    await this._queryVouchers(Array.from(this._voucherUpdateQueue.keys()));
    for (const [id, updaters] of this._voucherUpdateQueue) {
      const voucher = this._vouchers.get(id);
      if (!voucher) {
        this._ctx.log.error(`handleVoucherUpdated :: Voucher ${id} not found`);
        continue;
      }
      for (const update of updaters) update(voucher);
      this._activeVoucherIds?.set(id, voucher.expiryAtBlock);
    }
  }

  private async _saveVouchers() {
    if (this._transfers.size > 0) {
      await this._queryVouchers(Array.from(this._transfers.keys()));
    }

    if (this._vouchers.size > 0) {
      for (const [id, voucher] of this._vouchers) {
        if (this._transfers.has(id)) {
          voucher.balance = String(BigInt(voucher.balance) + this._transfers.get(id)!);
          this._transfers.delete(id);
        }
        if (this._revokedVouchers.has(id)) {
          this._vouchers.delete(id);
        }
      }

      await this._ctx.store.save(Array.from(this._vouchers.values()));
    }

    if (this._revokedVouchers.size > 0) {
      await this._ctx.store.remove(Voucher, Array.from(this._revokedVouchers));
    }
  }
}
