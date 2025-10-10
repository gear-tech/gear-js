import { Context, Log } from '../processor';
import * as RouterAbi from '../abi/router.abi';
import { BaseHandler } from './base';
import { Code, CodeStatus, Program } from '../model';
import { mapKeys, mapValues } from '../util';
import { In } from 'typeorm';
import { config } from '../config';

export class RouterHandler extends BaseHandler {
  private _codes: Map<string, Code>;
  private _codeStatuses: Map<string, CodeStatus>;
  private _programs: Map<string, Program>;

  protected _logs: { addr: string; topic0: string[] }[] = [
    {
      addr: config.routerAddr,
      topic0: [
        RouterAbi.events.CodeValidationRequested.topic,
        RouterAbi.events.CodeGotValidated.topic,
        RouterAbi.events.ProgramCreated.topic,
      ],
    },
  ];

  public async init(): Promise<void> {
    this._codes = new Map();
    this._codeStatuses = new Map();
    this._programs = new Map();
  }

  public async clear(): Promise<void> {
    this._codes.clear();
    this._programs.clear();
  }

  public async save(): Promise<void> {
    await Promise.all([this._saveCodes(), this._savePrograms()]);
  }

  private async _saveCodes(): Promise<void> {
    if (this._codes.size === 0 && this._codeStatuses.size === 0) return;

    for (const [codeId, code] of this._codes.entries()) {
      if (this._codeStatuses.has(codeId)) {
        code.status = this._codeStatuses.get(codeId)!;
        this._codeStatuses.delete(codeId);
      }
    }

    if (this._codeStatuses.size > 0) {
      const codes = await this._ctx.store.find(Code, { where: { id: In(mapKeys(this._codeStatuses)) } });

      for (const code of codes) {
        code.status = this._codeStatuses.get(code.id)!;
        this._codes.set(code.id, code);
      }
    }

    await this._ctx.store.save(mapValues(this._codes));
    this._logger.info(`${this._codes.size} codes saved`);
  }

  private async _savePrograms(): Promise<void> {
    if (this._programs.size === 0) return;

    await this._ctx.store.save(mapValues(this._programs));
    this._logger.info(`${this._programs.size} programs saved`);
  }

  public async process(ctx: Context): Promise<void> {
    await super.process(ctx);

    for (const block of ctx.blocks) {
      for (const log of block.logs as Log[]) {
        const topic = log.topics[0].toLowerCase();
        switch (topic) {
          case RouterAbi.events.CodeValidationRequested.topic: {
            this._handleCodeValidationRequested(log);
            continue;
          }
          case RouterAbi.events.CodeGotValidated.topic: {
            this._handleCodeGotValidated(log);
            continue;
          }
          case RouterAbi.events.ProgramCreated.topic: {
            this._handleProgramCreated(log);
            continue;
          }
        }
      }
    }
  }

  private _handleCodeValidationRequested(log: Log) {
    const data = RouterAbi.events.CodeValidationRequested.decode(log);
    this._codes.set(data.codeId, new Code({ id: data.codeId, status: CodeStatus.ValidationRequested }));
    this._logger.info({ codeId: data.codeId }, `Code validation requested`);
  }

  private _handleCodeGotValidated(log: Log) {
    const data = RouterAbi.events.CodeGotValidated.decode(log);
    const status = data.valid ? CodeStatus.Validated : CodeStatus.ValidationFailed;

    this._codeStatuses.set(data.codeId, status);
    this._logger.info({ codeId: data.codeId, status }, `Code validation completed`);
  }

  private _handleProgramCreated(log: Log) {
    const data = RouterAbi.events.ProgramCreated.decode(log);

    const program = new Program({
      id: data.actorId,
      codeId: data.codeId,
      blockNumber: BigInt(log.block.height),
      txHash: log.transaction.hash,
    });

    if (log.transaction.input.startsWith(RouterAbi.functions.createProgramWithAbiInterface.selector)) {
      const { abiInterface } = RouterAbi.functions.createProgramWithAbiInterface.decode(log.transaction);
      program.abiInterfaceAddress = abiInterface;
    }

    this._programs.set(program.id, program);
    this._logger.info(program, `Program created`);
  }
}
