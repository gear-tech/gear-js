import { Address } from 'viem';
import { In } from 'typeorm';

import { Code, CodeStatus, EntityType, HashRegistry, Program } from '../model/index.js';
import { mapKeys, mapValues } from '../util/index.js';
import { RouterAbi } from '../abi/router.abi.js';
import { Context, Log } from '../processor.js';
import { BaseHandler } from './base.js';
import { config } from '../config.js';

export class RouterHandler extends BaseHandler {
  private _codes: Map<string, Code>;
  private _codeStatuses: Map<string, CodeStatus>;
  private _programs: Map<string, Program>;
  private _address: Address;

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

  constructor() {
    super();
    this._address = config.routerAddr.toLowerCase() as Address;
  }

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

    const codes = mapValues(this._codes);

    for (const code of codes) {
      if (this._codeStatuses.has(code.id)) {
        code.status = this._codeStatuses.get(code.id)!;
        this._codeStatuses.delete(code.id);
      }
    }

    const hashes = codes.map(
      (code) => new HashRegistry({ id: code.id, type: EntityType.Code, createdAt: code.createdAt }),
    );

    if (this._codeStatuses.size > 0) {
      const _codes = await this._ctx.store.find(Code, { where: { id: In(mapKeys(this._codeStatuses)) } });

      for (const code of _codes) {
        code.status = this._codeStatuses.get(code.id)!;
        codes.push(code);
      }
    }

    await this._ctx.store.save(codes);
    this._logger.info(`${this._codes.size} codes saved`);

    await this._ctx.store.save(hashes);
  }

  private async _savePrograms(): Promise<void> {
    if (this._programs.size === 0) return;

    const programs = mapValues(this._programs);
    await this._ctx.store.save(programs);
    this._logger.info(`${this._programs.size} programs saved`);

    const hashes = programs.map(
      (program) => new HashRegistry({ id: program.id, type: EntityType.Program, createdAt: program.createdAt }),
    );

    await this._ctx.store.save(hashes);
  }

  public async process(_ctx: Context): Promise<void> {
    await super.process(_ctx);

    for (const block of this._ctx.blocks) {
      for (const log of block.logs as Log[]) {
        if (log.address.toLowerCase() !== this._address) continue;

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
    this._codes.set(
      data.args.codeId,
      new Code({
        id: data.args.codeId,
        status: CodeStatus.ValidationRequested,
        createdAt: new Date(log.block.timestamp),
      }),
    );
    this._logger.info({ codeId: data.args.codeId }, `Code validation requested`);
  }

  private _handleCodeGotValidated(log: Log) {
    const data = RouterAbi.events.CodeGotValidated.decode(log);
    const status = data.args.valid ? CodeStatus.Validated : CodeStatus.ValidationFailed;

    this._codeStatuses.set(data.args.codeId, status);
    this._logger.info({ codeId: data.args.codeId, status }, `Code validation completed`);
  }

  private _handleProgramCreated(log: Log) {
    const data = RouterAbi.events.ProgramCreated.decode(log);

    const program = new Program({
      id: data.args.actorId,
      codeId: data.args.codeId,
      blockNumber: BigInt(log.block.height),
      txHash: log.transaction.hash,
      createdAt: new Date(log.block.timestamp),
    });

    if (log.transaction.input.startsWith(RouterAbi.functions.createProgramWithAbiInterface.selector)) {
      const {
        args: [_codeId, _salt, _overrideInitializer, abiInterface],
      } = RouterAbi.functions.createProgramWithAbiInterface.decode(log.transaction);
      program.abiInterfaceAddress = abiInterface;
    }

    this._programs.set(program.id, program);
    this._logger.info(program, `Program created`);
  }
}
