import type { Logger } from '@subsquid/logger';

import { Context } from '../processor.js';

type LogSettings = { addr: string; topic0: string[] };
type TransactionSettings = { addr: string; sighash: string[] };

export abstract class BaseHandler {
  protected _logs: LogSettings[] = [];
  protected _transactions: TransactionSettings[] = [];
  protected _logger: Logger;
  protected _ctx: Context;

  constructor() {}

  public getLogs(): LogSettings[] {
    return this._logs;
  }

  public getTransactions(): TransactionSettings[] {
    return this._transactions;
  }

  public init(): Promise<void> {
    return Promise.resolve();
  }

  abstract clear(): void;

  async process(ctx: Context): Promise<void> {
    this._ctx = ctx;
    this._logger = ctx.log.child(this.constructor.name);
    this.clear();
  }

  abstract save(): Promise<void>;
}
