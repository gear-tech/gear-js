import { Entity } from '@subsquid/typeorm-store/lib/store.js';
import type { Logger } from '@subsquid/logger';

import { mapValues } from '../util/collection.js';
import { Context } from '../processor.js';
import { EntityType, HashRegistry } from '../model/index.js';

type LogSettings = { addr?: string; topic0?: string[] };
type TransactionSettings = { addr: string; sighash: string[] };

export abstract class BaseHandler {
  protected _logs: LogSettings[] = [];
  protected _transactions: TransactionSettings[] = [];
  protected _logger: Logger;
  protected _ctx: Context;

  private _hashes: Map<string, HashRegistry>;

  constructor() {}

  public getLogs(): LogSettings[] {
    return this._logs;
  }

  public getTransactions(): TransactionSettings[] {
    return this._transactions;
  }

  public init(): Promise<void> {
    this._hashes = new Map();
    return Promise.resolve();
  }

  clear(): void {
    this._hashes.clear();
  }

  async process(ctx: Context): Promise<void> {
    this._ctx = ctx;
    this._logger = ctx.log.child(this.constructor.name);
    this.clear();
  }

  async save(): Promise<void> {
    await this._defaultSave(this._hashes);
  }

  protected _addHashEntry(ty: EntityType, hash: string, createdAt: Date) {
    const entry = new HashRegistry({
      type: ty,
      id: hash,
      createdAt,
    });

    this._hashes.set(hash, entry);
  }

  protected async _defaultSave<E extends Entity>(_map: Map<string, E>): Promise<void> {
    if (_map.size === 0) return;

    const values = mapValues(_map);
    await this._ctx.store.save(values);

    this._logger.info(`${_map.size} ${values[0].constructor.name} saved`);
  }
}
