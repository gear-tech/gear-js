import { Address, zeroAddress } from 'viem';
import { In } from 'typeorm';

import {
  Batch,
  Code,
  CodeStatus,
  EntityType,
  EthereumTx,
  MessageSent,
  Program,
  ReplySent,
  StateTransition,
} from '../model/index.js';
import { createHash, fromPgBytea, mapKeys, mapValues, toPgBytea, toPgByteaString } from '../util/index.js';
import { RouterAbi } from '../abi/router.abi.js';
import { Context, Log } from '../processor.js';
import { BaseHandler } from './base.js';
import { config } from '../config.js';
import { BlockDataCommon } from '../types/block.js';

export class RouterHandler extends BaseHandler {
  private _address: Address;

  private _codes: Map<string, Code>;
  private _codeStatuses: Map<string, CodeStatus>;
  private _programs: Map<string, Program>;
  private _txs: Map<string, EthereumTx>;
  private _stateTransitions: Map<string, StateTransition>;
  private _batches: Map<string, Batch>;
  private _messagesSent: Map<string, MessageSent>;
  private _repliesSent: Map<string, ReplySent>;

  constructor() {
    super();
    this._address = config.routerAddr.toLowerCase() as Address;
    this._logs = [
      {
        addr: config.routerAddr,
        topic0: [
          RouterAbi.events.AnnouncesCommitted.topic,
          RouterAbi.events.BatchCommited.topic,
          RouterAbi.events.CodeGotValidated.topic,
          RouterAbi.events.CodeValidationRequested.topic,
          RouterAbi.events.ProgramCreated.topic,
          RouterAbi.events.ValidatorsCommittedForEra.topic,
        ],
      },
    ];
    this._transactions = [
      {
        addr: config.routerAddr,
        sighash: [
          RouterAbi.functions.commitBatch.selector,
          RouterAbi.functions.createProgram.selector,
          RouterAbi.functions.createProgramWithAbiInterface.selector,
          RouterAbi.functions.requestCodeValidation.selector,
        ],
      },
    ];
  }

  public async init(): Promise<void> {
    await super.init();
    this._codes = new Map();
    this._codeStatuses = new Map();
    this._programs = new Map();
    this._txs = new Map();
    this._stateTransitions = new Map();
    this._batches = new Map();
    this._messagesSent = new Map();
    this._repliesSent = new Map();
  }

  public async clear(): Promise<void> {
    super.clear();
    this._codes.clear();
    this._programs.clear();
    this._codeStatuses.clear();
    this._txs.clear();
    this._stateTransitions.clear();
    this._batches.clear();
    this._messagesSent.clear();
    this._repliesSent.clear();
  }

  public async save(): Promise<void> {
    await Promise.all([
      super.save(),
      this._saveCodes(),
      this._defaultSave(this._txs),
      this._defaultSave(this._batches),
    ]);
    await this._defaultSave(this._programs);
    await this._defaultSave(this._stateTransitions);
    await Promise.all([this._defaultSave(this._messagesSent), this._defaultSave(this._repliesSent)]);
  }

  private async _saveCodes(): Promise<void> {
    if (this._codes.size === 0 && this._codeStatuses.size === 0) return;

    const codes = mapValues(this._codes);

    for (const code of codes) {
      const id = fromPgBytea(code.id);
      if (this._codeStatuses.has(id)) {
        code.status = this._codeStatuses.get(id)!;
        this._codeStatuses.delete(id);
      }
    }

    if (this._codeStatuses.size > 0) {
      const _codes = await this._ctx.store.find(Code, { where: { id: In(mapKeys(this._codeStatuses)) } });

      for (const code of _codes) {
        code.status = this._codeStatuses.get(code.id)!;
        codes.push(code);
      }
    }

    await this._ctx.store.save(codes);
    this._logger.info(`${this._codes.size} codes saved`);
  }

  public async process(_ctx: Context): Promise<void> {
    await super.process(_ctx);

    for (const block of this._ctx.blocks) {
      const common: BlockDataCommon = {
        blockNumber: BigInt(block.header.height),
        timestamp: new Date(block.header.timestamp),
        blockHash: toPgBytea(block.header.hash),
      };

      for (const tx of block.transactions) {
        if (tx.to !== this._address) continue;

        const selector = tx.input.slice(0, 10);
        if (!this._transactions[0].sighash.includes(selector)) continue;

        const id = toPgByteaString(tx.hash);

        this._txs.set(
          tx.hash,
          new EthereumTx({
            id,
            contractAddress: toPgBytea(tx.to),
            sender: toPgBytea(tx.from),
            data: Buffer.from(tx.input.slice(2), 'hex'),
            blockNumber: common.blockNumber,
            selector,
            createdAt: common.timestamp,
          }),
        );

        this._logger.info({ txId: id, sender: tx.from, selector }, 'Transaction processed');

        this._addHashEntry(EntityType.Tx, id, common.timestamp);
      }

      for (const log of block.logs as Log[]) {
        if (log.address.toLowerCase() !== this._address) continue;

        const topic = log.topics[0].toLowerCase();
        switch (topic) {
          case RouterAbi.events.CodeValidationRequested.topic: {
            this._handleCodeValidationRequested(log, common);
            continue;
          }
          case RouterAbi.events.CodeGotValidated.topic: {
            this._handleCodeGotValidated(log);
            continue;
          }
          case RouterAbi.events.ProgramCreated.topic: {
            this._handleProgramCreated(log, common);
            continue;
          }
          case RouterAbi.events.BatchCommited.topic: {
            this._handleBatchCommited(log, common);
            continue;
          }
        }
      }
    }
  }

  private _handleCodeValidationRequested(log: Log, common: BlockDataCommon) {
    const data = RouterAbi.events.CodeValidationRequested.decode(log);
    const id = toPgByteaString(data.args.codeId);
    this._codes.set(
      id,
      new Code({
        id,
        status: CodeStatus.ValidationRequested,
        createdAt: common.timestamp,
      }),
    );
    this._addHashEntry(EntityType.Code, id, common.timestamp);
    this._logger.info({ codeId: data.args.codeId }, `Code validation requested`);
  }

  private _handleCodeGotValidated(log: Log) {
    const data = RouterAbi.events.CodeGotValidated.decode(log);
    const status = data.args.valid ? CodeStatus.Validated : CodeStatus.ValidationFailed;

    this._codeStatuses.set(data.args.codeId.toLowerCase(), status);
    this._logger.info({ codeId: data.args.codeId, status }, `Code validation completed`);
  }

  private _handleProgramCreated(log: Log, common: BlockDataCommon) {
    const data = RouterAbi.events.ProgramCreated.decode(log);

    const id = toPgByteaString(data.args.actorId);

    const program = new Program({
      id,
      codeId: toPgBytea(data.args.codeId),
      blockNumber: BigInt(log.block.height),
      txHash: toPgBytea(log.transaction.hash),
      createdAt: common.timestamp,
    });
    this._addHashEntry(EntityType.Program, id, common.timestamp);

    if (log.transaction.input.startsWith(RouterAbi.functions.createProgramWithAbiInterface.selector)) {
      const {
        args: [_codeId, _salt, _overrideInitializer, abiInterface],
      } = RouterAbi.functions.createProgramWithAbiInterface.decode(log.transaction);
      program.abiInterfaceAddress = toPgBytea(abiInterface);
    }

    this._programs.set(program.id, program);
    this._logger.info(program, `Program created`);
  }

  private _handleBatchCommited(log: Log, common: BlockDataCommon) {
    const {
      args: { hash },
    } = RouterAbi.events.BatchCommited.decode(log);

    const txData = RouterAbi.functions.commitBatch.decode(log.transaction);

    const batch = new Batch({
      id: toPgByteaString(hash),
      commitedAt: common.timestamp,
      commitedAtBlock: common.blockNumber,
      blockHash: toPgBytea(txData.args[0].blockHash),
      blockTimestamp: BigInt(txData.args[0].blockTimestamp),
      previousCommittedBatchHash: toPgBytea(txData.args[0].previousCommittedBatchHash),
      expiry: txData.args[0].expiry,
    });

    this._batches.set(batch.id, batch);
    this._addHashEntry(EntityType.Batch, batch.id, batch.commitedAt);

    const { chainCommitment } = txData.args[0];

    if (chainCommitment.length === 0) return;

    for (const trans of chainCommitment[0].transitions) {
      const transitionId = createHash(trans.actorId, trans.newStateHash);

      const stateTransition = new StateTransition({
        id: transitionId,
        hash: toPgBytea(trans.newStateHash),
        batch: batch,
        timestamp: common.timestamp,
        programId: toPgBytea(trans.actorId),
        exited: trans.exited,
        inheritor: trans.inheritor === zeroAddress ? null : toPgBytea(trans.inheritor),
        valueToReceive: trans.valueToReceive * (trans.valueToReceiveNegativeSign ? -1n : 1n),
      });
      this._stateTransitions.set(stateTransition.id, stateTransition);
      this._logger.info(
        { id: stateTransition.id, hash: trans.newStateHash, block: common.blockNumber },
        `State transition created`,
      );
      this._addHashEntry(EntityType.StateTransition, stateTransition.id, stateTransition.timestamp);

      for (const message of trans.messages) {
        this._processMessageFromTransition(message, trans.actorId, common, toPgBytea(fromPgBytea(transitionId)));
      }
    }
  }

  private _processMessageFromTransition(
    message: any,
    sourceProgramId: string,
    common: BlockDataCommon,
    stateTransitionId: Buffer,
  ): void {
    const id = toPgByteaString(message.id);

    const isReply = message.replyDetails.to !== '0x0000000000000000000000000000000000000000000000000000000000000000';

    if (isReply) {
      const replySent = new ReplySent({
        id,
        repliedToId: toPgBytea(message.replyDetails.to),
        replyCode: message.replyDetails.code,
        sourceProgramId: toPgBytea(sourceProgramId),
        destination: toPgBytea(message.destination),
        payload: Buffer.from(message.payload.slice(2), 'hex'),
        value: message.value,
        isCall: message.call,
        stateTransitionId,
        createdAt: common.timestamp,
      });

      this._repliesSent.set(id, replySent);
      this._logger.info(
        { replyId: message.id, repliedToId: message.replyDetails.to, sourceProgramId, transition: stateTransitionId },
        'Reply sent from program',
      );
      this._addHashEntry(EntityType.MessageRequest, id, common.timestamp);
    } else {
      const messageSent = new MessageSent({
        id,
        sourceProgramId: toPgBytea(sourceProgramId),
        destination: toPgBytea(message.destination),
        payload: Buffer.from(message.payload.slice(2), 'hex'),
        value: message.value,
        isCall: message.call,
        stateTransitionId,
        createdAt: common.timestamp,
      });

      this._messagesSent.set(id, messageSent);
      this._logger.info(
        { messageId: message.id, sourceProgramId, transition: stateTransitionId },
        'Message sent from program',
      );
      this._addHashEntry(EntityType.MessageSent, id, common.timestamp);
    }
  }
}
