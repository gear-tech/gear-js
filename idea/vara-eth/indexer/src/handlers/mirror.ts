import { type PgByteaString, toPgByteaString } from '@vara-eth/idea-indexer-db';

import { MirrorAbi } from '../abi/mirror.abi.js';
import { RouterAbi } from '../abi/router.abi.js';
import { config } from '../config.js';
import { EntityType, MessageRequest, Program, ReplyRequest } from '../model/index.js';
import type { Context, Log } from '../processor.js';
import type { BlockDataCommon } from '../types/index.js';
import { BaseHandler } from './base.js';

export class MirrorHandler extends BaseHandler {
  private _programAddresses: Set<PgByteaString>;
  private _messageRequests: Map<PgByteaString, MessageRequest>;
  private _replyRequests: Map<PgByteaString, ReplyRequest>;

  constructor() {
    super();
    this._logs = [
      {
        topic0: [MirrorAbi.events.MessageQueueingRequested.topic, MirrorAbi.events.ReplyQueueingRequested.topic],
      },
    ];
  }

  async init(): Promise<void> {
    await super.init();
    this._programAddresses = new Set();
    this._messageRequests = new Map();
    this._replyRequests = new Map();
  }

  clear(): void {
    super.clear();
    this._messageRequests.clear();
    this._replyRequests.clear();
  }

  async save(): Promise<void> {
    await Promise.all([super.save(), this._defaultSave(this._messageRequests), this._defaultSave(this._replyRequests)]);
  }

  async process(ctx: Context): Promise<void> {
    await super.process(ctx);

    if (this._programAddresses.size === 0) {
      await this._loadProgramAddresses();
    }

    this._syncNewPrograms();

    for (const block of this._ctx.blocks) {
      const common: BlockDataCommon = {
        blockNumber: BigInt(block.header.height),
        timestamp: new Date(block.header.timestamp),
        blockHash: toPgByteaString(block.header.hash),
      };

      for (const log of block.logs as Log[]) {
        const programId = toPgByteaString(log.address);

        if (!this._programAddresses.has(programId)) {
          continue;
        }
        console.log(programId);

        const topic = log.topics[0].toLowerCase();
        switch (topic) {
          case MirrorAbi.events.MessageQueueingRequested.topic: {
            this._handleMessageQueueingRequested(log, common, programId);
            break;
          }
          case MirrorAbi.events.ReplyQueueingRequested.topic: {
            this._handleReplyQueueingRequested(log, common, programId);
            break;
          }
        }
      }
    }
  }

  private async _loadProgramAddresses(): Promise<void> {
    const programs = await this._ctx.store.find(Program);

    for (const program of programs) {
      this._programAddresses.add(program.id);
    }

    this._logger.info(`Loaded ${this._programAddresses.size} program addresses`);
  }

  private _syncNewPrograms(): void {
    let count = 0;

    for (const block of this._ctx.blocks) {
      for (const log of block.logs as Log[]) {
        if (log.address.toLowerCase() !== config.routerAddr.toLowerCase()) continue;
        if (log.topics[0].toLowerCase() !== RouterAbi.events.ProgramCreated.topic) continue;
        const data = RouterAbi.events.ProgramCreated.decode(log);
        const programId = toPgByteaString(data.args.actorId);

        if (!this._programAddresses.has(programId)) {
          this._programAddresses.add(programId);
          count++;
        }
      }
    }

    if (count > 0) {
      this._logger.info(`Added ${count} new program addresses from current batch`);
    }
  }

  private _handleMessageQueueingRequested(log: Log, common: BlockDataCommon, programId: PgByteaString): void {
    const data = MirrorAbi.events.MessageQueueingRequested.decode(log);

    const id = toPgByteaString(data.args.id);

    const messageRequest = new MessageRequest({
      id,
      sourceAddress: toPgByteaString(data.args.source),
      programId,
      payload: toPgByteaString(data.args.payload),
      value: data.args.value,
      callReply: data.args.callReply,
      txHash: toPgByteaString(log.transactionHash),
      blockNumber: common.blockNumber,
      createdAt: common.timestamp,
    });

    this._messageRequests.set(id, messageRequest);
    this._addHashEntry(EntityType.MessageRequest, id, common.timestamp);
    this._logger.debug({ messageId: id, programId }, 'Message queuing requested');
  }

  private _handleReplyQueueingRequested(log: Log, common: BlockDataCommon, programId: PgByteaString): void {
    const data = MirrorAbi.events.ReplyQueueingRequested.decode(log);

    const id = toPgByteaString(data.args.repliedTo);

    const replyRequest = new ReplyRequest({
      id,
      sourceAddress: toPgByteaString(data.args.source),
      programId,
      payload: toPgByteaString(data.args.payload),
      value: data.args.value,
      txHash: toPgByteaString(log.transactionHash),
      blockNumber: common.blockNumber,
      createdAt: common.timestamp,
    });

    this._replyRequests.set(id, replyRequest);
    this._logger.debug({ repliedTo: data.args.repliedTo, programId }, 'Reply queuing requested');
  }
}
