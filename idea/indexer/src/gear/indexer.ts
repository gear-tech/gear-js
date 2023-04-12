import { CodeMetadata, ProgramMap, CodeChanged, GearApi, generateCodeHash, MessageQueued } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { filterEvents } from '@polkadot/api/util';
import { GenericEventData } from '@polkadot/types';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { SignedBlockExtended } from '@polkadot/api-derive/types';
import { EventNames, CodeStatus } from '@gear-js/common';
import { plainToInstance } from 'class-transformer';
import { VoidFn } from '@polkadot/api/types';
import { Option } from '@polkadot/types';

import {
  getExtrinsics,
  getMetahash,
  getPayloadAndValue,
  eventDataHandlers,
  MessageEntryPoint,
  MessageType,
  logger,
  UserMessageSentInput,
  UserMessageReadInput,
  ProgramChangedInput,
  CodeChangedInput,
  MessagesDispatchedDataInput,
} from '../common';
import { Block, Code, Message, Meta, Program } from '../database/entities';
import { BlockService, CodeService, MessageService, MetaService, ProgramService, StatusService } from '../services';
import { TempState } from './temp-state';
import config from '../config';

export class GearIndexer {
  public api: GearApi;
  private genesis: HexString;
  private unsub: VoidFn;
  private newBlocks: Array<number>;
  private lastBlockNumber: number;
  private generatorLoop: boolean;
  private tempState: TempState;

  constructor(
    programService: ProgramService,
    messageService: MessageService,
    codeService: CodeService,
    blockService: BlockService,
    metaService: MetaService,
    private statusService?: StatusService,
    private oneTimeSync: boolean = false,
  ) {
    this.tempState = new TempState(programService, messageService, codeService, blockService, metaService);
  }

  public async run(api: GearApi, onlyBlocks?: number[]) {
    this.api = api;
    this.genesis = this.api.genesisHash.toHex();
    this.newBlocks = [];
    this.generatorLoop = true;
    if (onlyBlocks) {
      logger.info(`Processing blocks from ${onlyBlocks[0]} to ${onlyBlocks.at(-1)}`);
      this.newBlocks = onlyBlocks;
      await this.indexBlocks();
    } else {
      this.unsub = await this.api.derive.chain.subscribeFinalizedHeads(({ number }) => {
        this.newBlocks.push(number.toNumber());
      });
      this.indexBlocks();
    }
  }

  public stop() {
    this.generatorLoop = false;
    this.unsub();
    this.api = null;
    this.newBlocks = [];
    this.lastBlockNumber = undefined;
  }

  private async *blocksGenerator() {
    while (this.generatorLoop) {
      if (this.newBlocks.length === 0) {
        if (this.oneTimeSync) {
          break;
        }
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        continue;
      }
      yield this.newBlocks.shift();
    }
  }

  private async indexBlocks() {
    for await (const blockNumber of this.blocksGenerator()) {
      if (this.lastBlockNumber === undefined) {
        logger.info(`Block processing started with ${blockNumber}.`);
      } else if (blockNumber === this.lastBlockNumber || blockNumber === 0) continue;
      else if (blockNumber - 1 !== this.lastBlockNumber && !this.oneTimeSync) {
        logger.warn(
          // eslint-disable-next-line max-len
          `Some blocks have been missed. The last processed block is ${this.lastBlockNumber} but the current is ${blockNumber}`,
        );
        for (let bn = this.lastBlockNumber + 1; bn < blockNumber; bn++) {
          await this.indexMissedBlock(bn);
        }
      }
      if (this.api === null) {
        console.log('api null');
        continue;
      }

      await this.indexBlock(blockNumber);
      this.lastBlockNumber = blockNumber;
    }
  }

  private async indexBlock(
    blockNumber: number,
    isMissed = false,
    interestedProgram?: string,
    interestedCode?: string,
  ): Promise<[Program, Code]> {
    if (blockNumber === 0) return;
    const block = await this.api.derive.chain.getBlockByNumber(blockNumber);

    const hash = block.block.header.hash.toHex();

    if (config.indexer.logEveryBlock) logger.info(`Processing block ${blockNumber}`);

    if (!isMissed) {
      this.tempState.newState(this.genesis);
    }

    const timestamp = (await this.api.blocks.getBlockTimestamp(block)).toNumber();

    await this.handleExtrinsics(block, timestamp);
    await this.handleEvents(block, timestamp);
    this.handleBlock(block, timestamp);

    try {
      await this.tempState.save();
    } catch (err) {
      logger.error(`Error during saving the data of the block ${blockNumber}. ${err.message}`);
      return [null, null];
    }
    if (this.oneTimeSync) {
      await this.statusService.update(this.genesis, blockNumber.toString(), hash);
    }
    return [
      interestedProgram ? await this.tempState.getProgram(interestedProgram) : null,
      interestedCode ? await this.tempState.getCode(interestedCode) : null,
    ];
  }

  eventHandlers: Record<EventNames, (data: any, timestamp: number, blockHash: HexString) => Promise<void> | void> = {
    [EventNames.UserMessageSent]: async (data: UserMessageSentInput, timestamp: number, blockHash: HexString) => {
      this.tempState.addMsg(
        plainToInstance(Message, {
          ...data,
          blockHash,
          genesis: this.genesis,
          timestamp: new Date(timestamp),
          type: MessageType.USER_MESS_SENT,
          program: await this.getProgram(data.source, blockHash, data.id),
        }),
      );
    },
    [EventNames.ProgramChanged]: async (data: ProgramChangedInput) =>
      await this.tempState.setProgramStatus(data.id, data.status, data.expiration),
    [EventNames.MessagesDispatched]: (data: MessagesDispatchedDataInput) =>
      this.tempState.setDispatchedStatus(data.statuses),
    [EventNames.UserMessageRead]: (data: UserMessageReadInput) => this.tempState.setReadStatus(data.id, data.reason),
    [EventNames.CodeChanged]: (data: CodeChangedInput) =>
      this.tempState.setCodeStatus(data.id, data.status, data.expiration),
  };

  private async handleEvents(block: SignedBlockExtended, timestamp: number): Promise<void> {
    const necessaryEvents = block.events.filter(({ event: { method } }) => Object.keys(EventNames).includes(method));
    for (const {
      event: { data, method },
    } of necessaryEvents) {
      let eventData = null;
      try {
        eventData = eventDataHandlers[method](data as GenericEventData);
      } catch (err) {
        logger.warn(`Unable to form event data, ${JSON.stringify({ method, data: data.toHuman() })}`);
        console.log(err);
        continue;
      }

      if (eventData === null) continue;

      const blockHash = block.block.header.hash.toHex();
      try {
        await this.eventHandlers[method](eventData, timestamp, blockHash);
      } catch (error) {
        logger.warn(
          JSON.stringify(
            {
              method,
              data: eventData,
              blockHash,
            },
            undefined,
            2,
          ),
        );
        console.error(error);
      }
    }
  }

  private async handleExtrinsics(block: SignedBlockExtended, timestamp: number): Promise<void> {
    if (this.api === null) return;

    const status = this.api.createType('ExtrinsicStatus', { finalized: block.block.header.hash.toHex() });

    await this.handleCodeExtrinsics(block, status, timestamp);

    await this.handleProgramExtrinsics(block, status, timestamp);

    await this.handleMessageExtrinsics(block, status, timestamp);
  }

  private async handleCodeExtrinsics(
    block: SignedBlockExtended,
    status: ExtrinsicStatus,
    timestamp: number,
  ): Promise<Code[]> {
    const extrinsics = getExtrinsics(block, ['uploadProgram', 'uploadCode']);

    if (extrinsics.length === 0) {
      return;
    }

    for (const tx of extrinsics) {
      const event = filterEvents(tx.hash, block, block.events, status).events.find(({ event }) =>
        this.api.events.gear.CodeChanged.is(event),
      );

      if (!event) {
        continue;
      }

      const {
        data: { id, change },
      } = event.event as CodeChanged;
      const codeId = id.toHex();
      const metahash = await getMetahash(this.api.code, codeId);

      const codeStatus = change.isActive ? CodeStatus.ACTIVE : change.isInactive ? CodeStatus.INACTIVE : null;
      const meta = metahash ? await this.tempState.getMeta(metahash) : null;

      this.tempState.addCode(
        plainToInstance(Code, {
          id: codeId,
          name: codeId,
          genesis: this.genesis,
          status: codeStatus,
          timestamp: new Date(timestamp),
          blockHash: block.block.header.hash.toHex(),
          expiration: change.isActive ? change.asActive.expiration.toString() : null,
          uploadedBy: tx.signer.inner.toHex(),
          meta,
        }),
      );
    }
  }

  private async handleProgramExtrinsics(
    block: SignedBlockExtended,
    status: ExtrinsicStatus,
    timestamp: number,
  ): Promise<Program[]> {
    const extrinsics = getExtrinsics(block, ['uploadProgram', 'createProgram']);

    if (extrinsics.length === 0) {
      return;
    }

    for (const tx of extrinsics) {
      const foundEvent = filterEvents(tx.hash, block, block.events, status).events.find(({ event }) =>
        this.api.events.gear.MessageQueued.is(event),
      );

      if (!foundEvent) {
        continue;
      }

      const {
        data: { source, destination },
      } = foundEvent.event as MessageQueued;
      const programId = destination.toHex();
      const owner = source.toHex();
      const blockHash = block.block.hash.toHex();

      const codeId = tx.method.method === 'uploadProgram' ? generateCodeHash(tx.args[0].toHex()) : tx.args[0].toHex();
      let code: Code;
      try {
        code = await this.tempState.getCode(codeId);
      } catch (err) {
        logger.error(
          `Unable to retrieve code by id ${codeId} for program ${programId} encountered in block ${blockHash}`,
        );
        code = await this.indexBlockWithMissedCode(codeId);
      }

      if (!code) {
        logger.error(
          `Unable to retrieve code by id ${codeId} for program ${programId}. Program won't be saved to the database.`,
        );
      }

      let meta: Meta;
      if (code?.meta) {
        meta = code.meta;
      } else {
        const metahash = await getMetahash(this.api.program, programId);
        meta = metahash ? await this.tempState.getMeta(metahash) : null;
      }

      this.tempState.addProgram(
        plainToInstance(Program, {
          id: programId,
          name: programId,
          owner,
          blockHash,
          timestamp: new Date(timestamp),
          code,
          genesis: this.genesis,
          meta,
        }),
      );
    }
  }

  private async handleMessageExtrinsics(block: SignedBlockExtended, status: ExtrinsicStatus, timestamp: number) {
    const extrinsics = getExtrinsics(block, ['sendMessage', 'sendReply', 'uploadProgram', 'createProgram']);
    if (extrinsics.length === 0) {
      return;
    }

    for (const tx of extrinsics) {
      const foundEvent = filterEvents(tx.hash, block, block.events, status).events.find(({ event }) =>
        this.api.events.gear.MessageQueued.is(event),
      );

      if (!foundEvent) {
        continue;
      }

      const {
        data: { id, source, destination, entry },
      } = foundEvent.event as MessageQueued;

      const [payload, value] = getPayloadAndValue(tx.args, tx.method.method);

      const messageEntry = entry.isInit
        ? MessageEntryPoint.INIT
        : entry.isHandle
          ? MessageEntryPoint.HANDLE
          : MessageEntryPoint.REPLY;

      const blockHash = block.block.header.hash.toHex();
      const msgId = id.toHex();
      const programId = destination.toHex();

      const program = await this.getProgram(programId, blockHash, msgId);

      this.tempState.addMsg(
        plainToInstance(Message, {
          id: msgId,
          blockHash,
          genesis: this.genesis,
          timestamp: new Date(timestamp),
          destination: destination.toHex(),
          source: source.toHex(),
          payload,
          value,
          program,
          type: MessageType.ENQUEUED,
          entry: messageEntry,
        }),
      );
    }
  }

  private handleBlock(block: SignedBlockExtended, timestamp: number) {
    const blockNumber = block.block.header.number.toString();
    this.tempState.addBlock(
      plainToInstance(Block, {
        hash: block.block.header.hash.toHex(),
        number: blockNumber,
        timestamp: new Date(timestamp),
        genesis: this.genesis,
      }),
    );
  }

  private async indexMissedBlock(number: number, interestedProgram?: string, interestedCode?: string) {
    logger.warn(`Index missed block ${number}`);
    return this.indexBlock(number, true, interestedProgram, interestedCode);
  }

  public async indexBlockWithMissedCode(codeId: HexString): Promise<Code | null> {
    const metaStorage = (await this.api.query.gearProgram.metadataStorage(codeId)) as Option<CodeMetadata>;
    if (metaStorage.isSome) {
      const blockNumber = metaStorage.unwrap().blockNumber.toNumber();

      return (await this.indexMissedBlock(blockNumber))[1];
    }
    logger.error(`Code with hash ${codeId} not found in storage`);
    return null;
  }

  public async indexBlockWithMissedProgram(programId: HexString): Promise<Program | null> {
    const progStorage = (await this.api.query.gearProgram.programStorage(programId)) as Option<ProgramMap>;
    if (progStorage.isSome) {
      const blockNumber = progStorage.unwrap()[1].toNumber();

      return (await this.indexMissedBlock(blockNumber))[0];
    }

    logger.error(`Program with id ${programId} not found in storage`);
    return null;
  }

  private async getProgram(id: HexString, blockHash: HexString, msgId: HexString) {
    let program: Program;
    try {
      program = await this.tempState.getProgram(id);
    } catch (err) {
      logger.error(`Unable to retrieve program by id ${id} for message ${msgId} encountered in block ${blockHash}`);
      program = await this.indexBlockWithMissedProgram(id);
    }
    return program;
  }
}
