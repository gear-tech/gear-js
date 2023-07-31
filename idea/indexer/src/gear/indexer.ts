import {
  CodeMetadata,
  CodeChanged,
  GearApi,
  generateCodeHash,
  MessageQueued,
  IProgram,
  ProgramChangedData,
} from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { filterEvents } from '@polkadot/api/util';
import { GenericEventData } from '@polkadot/types';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { SignedBlockExtended } from '@polkadot/api-derive/types';
import { EventNames, CodeStatus } from '@gear-js/common';
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
  ProgramStatus,
} from '../common';
import { Block, Code, Message, Program } from '../database/entities';
import { BlockService, CodeService, MessageService, ProgramService, StatusService } from '../services';
import { TempState } from './temp-state';
import config from '../config';
import { RMQService } from '../rmq';

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
    rmq: RMQService,
    private statusService?: StatusService,
    private oneTimeSync: boolean = false,
  ) {
    this.tempState = new TempState(programService, messageService, codeService, blockService, rmq);
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

  private async indexBlock(blockNumber: number, isMissed = false): Promise<void> {
    if (blockNumber === 0) return;

    let block: SignedBlockExtended;

    try {
      block = await this.api.derive.chain.getBlockByNumber(blockNumber);
    } catch (err) {
      logger.error(`Unable to get block ${blockNumber} due to the following error`);
      console.log(err);
      return;
    }

    const hash = block.block.header.hash.toHex();

    if (config.indexer.logEveryBlock) logger.info(`Processing block ${blockNumber}`);

    if (!isMissed) {
      this.tempState.newState(this.genesis);
    }

    const timestamp = (await this.api.blocks.getBlockTimestamp(block)).toNumber();

    await this.handleExtrinsics(block, timestamp);
    await this.handleProgramsCreatedFromPrograms(block, timestamp);
    await this.handleEvents(block, timestamp);
    this.handleBlock(block, timestamp);

    try {
      await this.tempState.save();
    } catch (err) {
      logger.error(`Error during saving the data of the block ${blockNumber}. ${err.message}`);
    }
    if (this.oneTimeSync) {
      await this.statusService.update(this.genesis, blockNumber.toString(), hash);
    }
  }

  eventHandlers: Record<EventNames, (data: any, timestamp: number, blockHash: HexString) => Promise<void> | void> = {
    [EventNames.UserMessageSent]: async (data: UserMessageSentInput, timestamp: number, blockHash: HexString) => {
      this.tempState.addMsg(
        new Message({
          ...data,
          blockHash,
          genesis: this.genesis,
          timestamp: new Date(timestamp),
          type: MessageType.USER_MESS_SENT,
          program: await this.getProgram(data.source, blockHash, data.id),
        }),
      );
    },
    [EventNames.ProgramChanged]: async (data: ProgramChangedInput) => {
      await this.tempState.setProgramStatus(data.id, data.status, data.expiration);
    },
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

      this.tempState.addCode(
        new Code({
          id: codeId,
          name: codeId,
          genesis: this.genesis,
          status: codeStatus,
          timestamp: new Date(timestamp),
          blockHash: block.block.header.hash.toHex(),
          expiration: change.isActive ? change.asActive.expiration.toString() : null,
          uploadedBy: tx.signer.inner.toHex(),
          metahash,
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
      const mqEvent = filterEvents(tx.hash, block, block.events, status).events.find(({ event }) =>
        this.api.events.gear.MessageQueued.is(event),
      );

      if (!mqEvent) {
        continue;
      }

      const {
        data: { source, destination },
      } = mqEvent.event as MessageQueued;
      const programId = destination.toHex();
      const owner = source.toHex();
      const blockHash = block.block.hash.toHex();

      const codeId = tx.method.method === 'uploadProgram' ? generateCodeHash(tx.args[0].toHex()) : tx.args[0].toHex();
      const code = await this.getCode(codeId, blockHash, programId);

      this.tempState.addProgram(
        new Program({
          id: programId,
          name: programId,
          owner,
          blockHash,
          timestamp: new Date(timestamp),
          code,
          genesis: this.genesis,
          metahash: await this.getMeta(programId, code),
          status: ProgramStatus.PROGRAM_SET,
          hasState: code.hasState,
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
        new Message({
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

  private async handleProgramsCreatedFromPrograms(block: SignedBlockExtended, timestamp: number) {
    const progChangedEvents = block.events
      .filter(
        ({ event: { method, data } }) =>
          method === EventNames.ProgramChanged && (data as ProgramChangedData).change.isProgramSet,
      )
      .map(({ event: { data } }: any) => data.id.toHex());

    const blockHash = block.block.header.hash.toHex();

    for (const id of progChangedEvents) {
      const program = await this.getProgramWithoutIndexing(id);
      if (!program) {
        const progStorage = (await this.api.query.gearProgram.programStorage(id)) as Option<IProgram>;
        if (progStorage.isSome) {
          if (progStorage.unwrap().isActive) {
            const { codeHash } = progStorage.unwrap().asActive;
            const code = await this.getCode(codeHash.toHex(), blockHash, id);
            this.tempState.addProgram(
              new Program({
                id,
                name: id,
                blockHash,
                timestamp: new Date(timestamp),
                genesis: this.genesis,
                code,
                metahash: await this.getMeta(id, code),
                status: ProgramStatus.PROGRAM_SET,
              }),
            );
          }
        }
      }
    }
  }

  private handleBlock(block: SignedBlockExtended, timestamp: number) {
    const blockNumber = block.block.header.number.toString();
    this.tempState.addBlock(
      new Block({
        hash: block.block.header.hash.toHex(),
        number: blockNumber,
        timestamp: new Date(timestamp),
        genesis: this.genesis,
      }),
    );
  }

  private async indexMissedBlock(number: number) {
    logger.warn(`Index missed block ${number}`);
    return this.indexBlock(number, true);
  }

  public async indexBlockWithMissedCode(codeId: HexString): Promise<Code | null> {
    const metaStorage = (await this.api.query.gearProgram.metadataStorage(codeId)) as Option<CodeMetadata>;
    if (metaStorage.isSome) {
      const blockNumber = metaStorage.unwrap().blockNumber.toNumber();

      await this.indexMissedBlock(blockNumber);

      return this.tempState.getCode(codeId);
    }
    logger.error(`Code with hash ${codeId} not found in storage`);
    return null;
  }

  public async indexBlockWithMissedProgram(programId: HexString): Promise<Program | null> {
    const progStorage = (await this.api.query.gearProgram.programStorage(programId)) as Option<IProgram>;

    if (progStorage.isSome) {
      const blockNumber = progStorage.unwrap()[1].toNumber();

      await this.indexMissedBlock(blockNumber);

      return this.tempState.getProgram(programId);
    }

    logger.error(`Program with id ${programId} not found in storage`);
    return null;
  }

  private getProgramWithoutIndexing(id: HexString): Promise<Program> {
    return this.tempState.getProgram(id);
  }

  private async getProgram(id: HexString, blockHash: HexString, msgId: HexString): Promise<Program> {
    let program = await this.tempState.getProgram(id);
    if (!program) {
      logger.error(`Unable to retrieve program by id ${id} for message ${msgId} encountered in block ${blockHash}`);
      program = await this.indexBlockWithMissedProgram(id);
    }
    return program;
  }

  private async getCode(id: HexString, blockHash: HexString, programId: HexString): Promise<Code> {
    let code = await this.tempState.getCode(id);
    if (!code) {
      logger.error(`Unable to retrieve code by id ${id} of program ${programId} encountered in block ${blockHash}`);
      code = await this.indexBlockWithMissedCode(id);
    }
    return code;
  }

  private async getMeta(programId: HexString, code: Code): Promise<string> {
    if (code?.metahash) {
      return code.metahash;
    } else {
      const metahash = await getMetahash(this.api.program, programId);
      return metahash;
    }
  }
}
