import { type PgByteaString, toPgByteaString } from '@vara-eth/idea-indexer-db';
import { In } from 'typeorm';
import { type Address, zeroAddress, zeroHash } from 'viem';

import {
  decodeUpgradedEvent,
  getAllRouterEventTopics,
  getAllRouterFunctionSelectors,
  ROUTER_UPGRADED_TOPIC,
  ROUTER_VERSION_TO_ABI,
  RouterAbi,
  type RouterAbiShape,
} from '../abi/router.abi.js';
import { config } from '../config.js';
import {
  Batch,
  Code,
  CodeStatus,
  EntityType,
  EthereumTx,
  MessageSent,
  Program,
  ReplySent,
  RouterImplementation,
  StateTransition,
} from '../model/index.js';
import type { Context, Log } from '../processor.js';
import type { BlockDataCommon } from '../types/block.js';
import { createHash, mapKeys, mapValues } from '../util/index.js';
import { BaseHandler } from './base.js';

export class RouterHandler extends BaseHandler {
  private _address: Address;

  private _codes: Map<PgByteaString, Code>;
  private _codeStatuses: Map<PgByteaString, CodeStatus>;
  private _programs: Map<PgByteaString, Program>;
  private _txs: Map<PgByteaString, EthereumTx>;
  private _stateTransitions: Map<PgByteaString, StateTransition>;
  private _batches: Map<PgByteaString, Batch>;
  private _messagesSent: Map<PgByteaString, MessageSent>;
  private _repliesSent: Map<PgByteaString, ReplySent>;

  // Sorted ascending by fromBlock. Populated from DB on init().
  private _implHistory: Array<{ id: string; fromBlock: bigint; abi: RouterAbiShape }> = [];

  constructor() {
    super();
    this._address = config.routerAddr.toLowerCase() as Address;
    this._logs = [
      {
        addr: config.routerAddr,
        topic0: [...getAllRouterEventTopics(), ROUTER_UPGRADED_TOPIC],
      },
    ];
    this._transactions = [
      {
        addr: config.routerAddr,
        sighash: getAllRouterFunctionSelectors(),
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

  private _getAbi(blockNumber: number): RouterAbiShape {
    const bn = BigInt(blockNumber);
    for (let i = this._implHistory.length - 1; i >= 0; i--) {
      if (this._implHistory[i].fromBlock <= bn) return this._implHistory[i].abi;
    }
    this._logger.error('No ABI version found for block, using latest');
    return RouterAbi;
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
      if (this._codeStatuses.has(code.id)) {
        code.status = this._codeStatuses.get(code.id)!;
        this._codeStatuses.delete(code.id);
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

  private async _loadImplHistory(): Promise<void> {
    const records = await this._ctx.store.find(RouterImplementation, { order: { fromBlock: 'ASC' } });

    if (records.length === 0) {
      this._logger.error('No router implementations found in DB — seed the initial implementation and redeploy');
      process.exit(1);
    }

    this._implHistory = records.map((r) => {
      const abi = ROUTER_VERSION_TO_ABI[r.version];
      if (!abi) {
        this._logger.error(
          { implementation: r.id, version: r.version },
          'Router ABI version in DB not found in ROUTER_VERSION_TO_ABI — add it and redeploy',
        );
        process.exit(1);
      }
      return { id: r.id.toLowerCase(), fromBlock: r.fromBlock, abi: abi! };
    });
  }

  public async process(_ctx: Context): Promise<void> {
    await super.process(_ctx);

    if (this._implHistory.length === 0) {
      await this._loadImplHistory();
    }

    for (const block of this._ctx.blocks) {
      const common: BlockDataCommon = {
        blockNumber: BigInt(block.header.height),
        timestamp: new Date(block.header.timestamp),
        blockHash: toPgByteaString(block.header.hash),
      };

      for (const tx of block.transactions) {
        if (tx.to !== this._address) continue;

        const selector = tx.input.slice(0, 10);
        if (!this._transactions[0].sighash.includes(selector)) continue;

        const id = toPgByteaString(tx.hash);

        this._txs.set(
          id,
          new EthereumTx({
            id,
            contractAddress: toPgByteaString(tx.to),
            sender: toPgByteaString(tx.from),
            data: toPgByteaString(tx.input),
            blockNumber: common.blockNumber,
            selector: toPgByteaString(selector),
            createdAt: common.timestamp,
          }),
        );

        this._logger.info({ txId: id, sender: tx.from, selector }, 'Transaction processed');

        this._addHashEntry(EntityType.Tx, id, common.timestamp);
      }

      for (const log of block.logs as Log[]) {
        if (log.address.toLowerCase() !== this._address) continue;

        const topic = log.topics[0].toLowerCase();

        if (topic === ROUTER_UPGRADED_TOPIC) {
          const { implementation } = decodeUpgradedEvent(log);
          const implLower = implementation.toLowerCase();
          const record = await this._ctx.store.findOne(RouterImplementation, { where: { id: implLower } });
          if (!record) {
            this._logger.error(
              { implementation: implLower, block: log.block.height },
              `Router upgraded to unknown implementation. Pre-seed the DB and restart: ` +
                `INSERT INTO router_implementation (id, from_block, version) VALUES ('${implLower}', ${log.block.height}, '<version>');`,
            );
            process.exit(1);
          }
          const nextAbi = ROUTER_VERSION_TO_ABI[record.version];
          if (!nextAbi) {
            this._logger.error(
              { implementation: implLower, version: record.version },
              'Router ABI version in DB not found in ROUTER_VERSION_TO_ABI — add it and redeploy',
            );
            process.exit(1);
          }
          record.fromBlock = BigInt(log.block.height);
          await this._ctx.store.save(record);

          const existingIndex = this._implHistory.findIndex((h) => h.id === implLower);
          if (existingIndex !== -1) {
            this._implHistory[existingIndex].fromBlock = record.fromBlock;
          } else {
            this._implHistory.push({ id: implLower, fromBlock: record.fromBlock, abi: nextAbi });
          }
          this._implHistory.sort((a, b) => (a.fromBlock < b.fromBlock ? -1 : a.fromBlock > b.fromBlock ? 1 : 0));

          this._logger.info(
            { implementation: implLower, version: record.version, fromBlock: log.block.height },
            'Router upgraded — switched ABI version',
          );
          continue;
        }

        // NOTE: case labels are derived from the latest RouterAbi topics.
        // If a future upgrade changes a topic, add an additional case for the old topic
        // pointing to the same handler — _getAbi() will select the correct decoder.
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
          case RouterAbi.events.BatchCommitted.topic: {
            this._handleBatchCommitted(log, common);
            continue;
          }
        }
      }
    }
  }

  private _handleCodeValidationRequested(log: Log, common: BlockDataCommon) {
    const data = this._getAbi(log.block.height).events.CodeValidationRequested.decode(log);
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
    this._logger.info({ codeId: data.args.codeId }, 'Code validation requested');
  }

  private _handleCodeGotValidated(log: Log) {
    const data = this._getAbi(log.block.height).events.CodeGotValidated.decode(log);
    const status = data.args.valid ? CodeStatus.Validated : CodeStatus.ValidationFailed;

    this._codeStatuses.set(toPgByteaString(data.args.codeId), status);
    this._logger.info({ codeId: data.args.codeId, status }, 'Code validation completed');
  }

  private _handleProgramCreated(log: Log, common: BlockDataCommon) {
    const abi = this._getAbi(log.block.height);
    const data = abi.events.ProgramCreated.decode(log);

    const id = toPgByteaString(data.args.actorId);

    const program = new Program({
      id,
      codeId: toPgByteaString(data.args.codeId),
      blockNumber: BigInt(log.block.height),
      txHash: toPgByteaString(log.transaction.hash),
      createdAt: common.timestamp,
    });
    this._addHashEntry(EntityType.Program, id, common.timestamp);

    if (log.transaction.input.startsWith(abi.functions.createProgramWithAbiInterface.selector)) {
      const {
        args: [_codeId, _salt, _overrideInitializer, abiInterface],
      } = abi.functions.createProgramWithAbiInterface.decode(log.transaction);
      program.abiInterfaceAddress = toPgByteaString(abiInterface);
    }

    this._programs.set(program.id, program);
    this._logger.info(program, 'Program created');
  }

  private _handleBatchCommitted(log: Log, common: BlockDataCommon) {
    const abi = this._getAbi(log.block.height);
    const {
      args: { hash },
    } = abi.events.BatchCommitted.decode(log);

    const txData = abi.functions.commitBatch.decode(log.transaction);

    const batch = new Batch({
      id: toPgByteaString(hash),
      committedAt: common.timestamp,
      committedAtBlock: common.blockNumber,
      blockHash: toPgByteaString(txData.args[0].blockHash),
      blockTimestamp: BigInt(txData.args[0].blockTimestamp),
      previousCommittedBatchHash: toPgByteaString(txData.args[0].previousCommittedBatchHash),
      expiry: BigInt(txData.args[0].expiry),
    });

    this._batches.set(batch.id, batch);
    this._addHashEntry(EntityType.Batch, batch.id, batch.committedAt);

    const { chainCommitment } = txData.args[0];

    if (chainCommitment.length === 0) return;

    for (const trans of chainCommitment[0].transitions) {
      const transitionId = createHash(trans.actorId, trans.newStateHash);

      const stateTransition = new StateTransition({
        id: transitionId,
        hash: toPgByteaString(trans.newStateHash),
        batch: batch,
        programId: toPgByteaString(trans.actorId),
        exited: trans.exited,
        inheritor: trans.inheritor === zeroAddress ? null : toPgByteaString(trans.inheritor),
        valueToReceive: trans.valueToReceive * (trans.valueToReceiveNegativeSign ? -1n : 1n),
        createdAt: common.timestamp,
      });
      this._stateTransitions.set(stateTransition.id, stateTransition);
      this._logger.info(
        { id: stateTransition.id, hash: trans.newStateHash, block: common.blockNumber },
        'State transition created',
      );
      this._addHashEntry(EntityType.StateTransition, stateTransition.id, stateTransition.createdAt);

      for (const message of trans.messages) {
        this._processMessageFromTransition(message, toPgByteaString(trans.actorId), common, stateTransition.id);
      }
    }
  }

  private _processMessageFromTransition(
    message: any,
    sourceProgramId: PgByteaString,
    common: BlockDataCommon,
    stateTransitionId: PgByteaString,
  ): void {
    const id = toPgByteaString(message.id);

    const isReply = message.replyDetails.to !== zeroHash;

    if (isReply) {
      const replySent = new ReplySent({
        id,
        repliedToId: toPgByteaString(message.replyDetails.to),
        replyCode: message.replyDetails.code,
        sourceProgramId,
        destination: toPgByteaString(message.destination),
        payload: toPgByteaString(message.payload),
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
    } else {
      const messageSent = new MessageSent({
        id,
        sourceProgramId: sourceProgramId,
        destination: toPgByteaString(message.destination),
        payload: toPgByteaString(message.payload),
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
