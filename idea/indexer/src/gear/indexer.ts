import { CodeChanged, GearApi, generateCodeHash, MessageQueued } from '@gear-js/api';
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
  BlockParams,
  MessageEntryPoint,
  MessageType,
  logger,
} from '../common';
import { Block, Code, Message, Program } from '../database/entities';

import { BlockService, CodeService, MessageService, MetaService, ProgramService, StatusService } from '../services';

export class GearIndexer {
  public api: GearApi;
  private genesis: HexString;
  private unsub: VoidFn;
  private newBlocks: Array<BlockParams>;
  private lastBlockNumber: number;
  private generatorLoop: boolean;

  constructor(
    private programService: ProgramService,
    private messageService: MessageService,
    private codeService: CodeService,
    private blockService: BlockService,
    private metaService: MetaService,
    private statusService?: StatusService,
    private oneTimeSync: boolean = false,
  ) {}

  public async run(api: GearApi, onlyBlocks?: number[]) {
    this.api = api;
    this.genesis = this.api.genesisHash.toHex();
    this.newBlocks = [];
    this.generatorLoop = true;
    if (onlyBlocks) {
      logger.info(`Processing blocks from ${onlyBlocks[0]} to ${onlyBlocks.at(-1)}`);
      this.indexBlocks();
      for (const bn of onlyBlocks) {
        const hash = await this.api.rpc.chain.getBlockHash(bn);
        this.newBlocks.push({ blockNumber: bn, hash: hash.toHex() });
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
      }
    } else {
      this.unsub = await this.api.derive.chain.subscribeFinalizedHeads(({ number, hash }) => {
        this.newBlocks.push({ blockNumber: number.toNumber(), hash: hash.toHex() });
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
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        continue;
      }
      yield this.newBlocks.shift();
    }
  }

  private async indexBlocks() {
    for await (const { hash, blockNumber } of this.blocksGenerator()) {
      if (this.lastBlockNumber === undefined) {
        logger.info(`Block processing started with ${blockNumber}.`);
      } else if (blockNumber === this.lastBlockNumber || blockNumber === 0) continue;
      else if (blockNumber - 1 !== this.lastBlockNumber) {
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

      await this.indexBlock(hash);
      this.lastBlockNumber = blockNumber;
    }
  }

  private async indexBlock(hash: HexString): Promise<[Program[], Code[]]> {
    const block = await this.api.derive.chain.getBlock(hash);

    if (block.block.header.number.eq(0)) return;

    const timestamp = (await this.api.blocks.getBlockTimestamp(block)).toNumber();

    const programsAndCodes = await this.handleExtrinsics(block, timestamp);
    await this.handleEvents(block, timestamp, hash);
    await this.handleBlock(block, timestamp, hash);
    if (this.oneTimeSync) {
      await this.statusService.update(this.genesis, block.block.header.number.toString(), hash);
    }
    return programsAndCodes;
  }

  eventHandlers: Record<EventNames, (data: any, timestamp?: number) => Promise<unknown>> = {
    [EventNames.UserMessageSent]: async (data: any, timestamp: number) => {
      const message = plainToInstance(Message, {
        ...data,
        genesis: this.genesis,
        timestamp: new Date(timestamp),
        type: MessageType.USER_MESS_SENT,
        program: await this.programService.get({ id: data.source, genesis: this.genesis }),
      });
      await this.messageService.create([message]);
    },
    [EventNames.ProgramChanged]: async (data: any) =>
      await this.programService.setStatus(data.id, this.genesis, data.programStatus),
    [EventNames.MessagesDispatched]: (data: any) =>
      this.messageService.setDispatchedStatus({ ...data, genesis: this.genesis }),
    [EventNames.UserMessageRead]: (data: any) => this.messageService.updateReadStatus(data.id, data.reason),
    [EventNames.CodeChanged]: (data: any) => this.codeService.setCodeStatuses([data], this.genesis),
  };

  private async handleEvents(block: SignedBlockExtended, timestamp: number, hash: HexString): Promise<void> {
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
      eventData.blockHash = hash;

      try {
        await this.eventHandlers[method](eventData, timestamp);
      } catch (error) {
        logger.warn(
          JSON.stringify(
            {
              method,
              data: eventData,
              blockHash: hash,
            },
            undefined,
            2,
          ),
        );
        console.error(error);
      }
    }
  }

  private async handleExtrinsics(block: SignedBlockExtended, timestamp: number): Promise<[Program[], Code[]]> {
    if (this.api === null) return;
    const status = this.api.createType('ExtrinsicStatus', { finalized: block.block.header.hash.toHex() });

    const codes = await this.handleCodeExtrinsics(block, status, timestamp);

    const programs = await this.handleProgramExtrinsics(block, status, timestamp);

    await this.handleMessageExtrinsics(block, status, timestamp);

    return [programs, codes];
  }

  private async handleMessageExtrinsics(block: SignedBlockExtended, status: ExtrinsicStatus, timestamp: number) {
    const extrinsics = getExtrinsics(block, ['sendMessage', 'sendReply', 'uploadProgram', 'createProgram']);
    if (extrinsics.length === 0) {
      return;
    }

    const messages: Message[] = [];

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

      messages.push(
        plainToInstance(Message, {
          id: id.toHex(),
          destination: destination.toHex(),
          source: source.toHex(),
          payload,
          value,
          timestamp: new Date(timestamp),
          genesis: this.genesis,
          program: await this.programService.get({ id: destination.toHex(), genesis: this.genesis }),
          type: MessageType.ENQUEUED,
          entry: messageEntry,
        }),
      );

      await this.messageService.create(messages);
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

    const programs: Program[] = [];

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
        code = await this.codeService.get({ id: codeId, genesis: this.genesis });
      } catch (err) {
        logger.error(
          `Unable to retrieve code by id ${codeId} for program ${programId} encountered in block ${blockHash}`,
        );
        await this.indexBlockWithMissedCode(codeId);
      }

      code = await this.codeService.get({ id: codeId, genesis: this.genesis });

      if (!code) {
        logger.error(
          `Unable to retrieve code by id ${codeId} for program ${programId}. Program won't be saved to the database.`,
        );
        continue;
      }

      const metahash = await getMetahash(this.api.program, programId);
      const meta = metahash ? await this.metaService.getByHashOrCreate(metahash) : null;

      programs.push(
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

    return this.programService.create(programs);
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

    const codes: Code[] = [];

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
      const meta = metahash ? await this.metaService.getByHashOrCreate(metahash) : null;

      codes.push(
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

    return this.codeService.create(codes);
  }

  private async handleBlock(block: SignedBlockExtended, timestamp: number, hash: HexString) {
    const blockNumber = block.block.header.number.toString();
    await this.blockService.create(
      plainToInstance(Block, {
        hash,
        number: blockNumber,
        timestamp: new Date(timestamp),
        genesis: this.genesis,
      }),
    );
  }

  public async indexMissedBlock(number: number) {
    const hash = await this.api.blocks.getBlockHash(number);
    logger.warn(`Index missed block ${number} with hash ${hash.toHex()}`);
    return this.indexBlock(hash.toHex());
  }

  private async indexBlockWithMissedCode(codeId: HexString) {
    const metaStorage = (await this.api.query.gearProgram.metadataStorage(codeId)) as Option<any>;
    if (metaStorage.isSome) {
      const blockNumber = metaStorage.unwrap()['blockNumber'].toNumber();

      return this.indexMissedBlock(blockNumber);
    }
    logger.error(`Code with hash ${codeId} not found in storage`);
  }
}
