import { Injectable, Logger } from '@nestjs/common';
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

import { ProgramService } from '../program/program.service';
import { MessageService } from '../message/message.service';
import { CodeService } from '../code/code.service';
import { getExtrinsics, getMetahash, getPayloadAndValue, eventDataHandlers } from '../common/helpers';
import { MessageEntryPoint, MessageType } from '../common/enums';
import { Code, Message, Program } from '../database/entities';
import { CodeRepo } from '../code/code.repo';
import { changeStatus } from '../healthcheck/healthcheck.controller';
import { ProgramRepo } from '../program/program.repo';
import { BlockService } from '../block/block.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { MetaService } from '../meta/meta.service';
import { sleep } from '../utils/sleep';
import config from '../config/configuration';
import { BlockParams } from '../common/types';

const gearConfig = config().gear;

const MAX_RECONNECTIONS = 10;
let reconnectionsCounter = 0;

@Injectable()
export class GearService {
  private logger: Logger = new Logger(GearService.name);
  public api: GearApi;
  public genesis: HexString;
  private unsub: VoidFn;
  private newBlocks: Array<BlockParams>;
  private lastBlockNumber: number;

  constructor(
    private programService: ProgramService,
    private programRepository: ProgramRepo,
    private messageService: MessageService,
    private codeService: CodeService,
    private codeRepository: CodeRepo,
    private blockService: BlockService,
    private rabbitMQService: RabbitmqService,
    private metaService: MetaService,
  ) {}

  public async run() {
    await this.rabbitMQService.initRMQ();
    await this.connect();
  }

  private async reconnect(): Promise<void> {
    this.newBlocks = [];
    this.unsub && this.unsub();
    if (this.api) {
      await this.api.disconnect();
      this.api = null;
    }
    reconnectionsCounter++;
    if (reconnectionsCounter > MAX_RECONNECTIONS) {
      throw new Error(`Unable to connect to ${gearConfig.wsProvider}`);
    }
    this.logger.log('⚙️ 📡 Reconnecting to the gear node');
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    this.rabbitMQService.deleteGenesisQueue(this.genesis);
    changeStatus('gear');
    return this.connect();
  }

  private async connect(): Promise<void> {
    this.api = new GearApi({ providerAddress: gearConfig.wsProvider });
    try {
      await this.api.isReadyOrError;
    } catch (error) {
      this.logger.error(`Failed to connect to ${gearConfig.wsProvider}`);
    }
    await this.api.isReady;
    this.api.on('disconnected', () => {
      this.reconnect();
    });

    this.genesis = this.api.genesisHash.toHex();
    this.rabbitMQService.addGenesisQueue(this.genesis);
    this.logger.log(`⚙️ Connected to ${this.api.runtimeChain} with genesis ${this.genesis}`);
    reconnectionsCounter = 0;
    this.unsub = await this.listen();
    this.indexBlocks();
    changeStatus('gear');
  }

  private async listen() {
    this.newBlocks = [];
    return this.api.derive.chain.subscribeFinalizedHeads(({ number, hash }) => {
      this.newBlocks.push({ blockNumber: number.toNumber(), hash: hash.toHex() });
    });
  }

  private async *blocksGenerator() {
    while (true) {
      if (this.newBlocks.length === 0) {
        await sleep(1000);
        continue;
      }
      yield this.newBlocks.shift();
    }
  }

  private async indexBlocks() {
    for await (const { hash, blockNumber } of this.blocksGenerator()) {
      if (this.lastBlockNumber === undefined) {
        this.logger.log(`Block processing started with ${blockNumber}.`);
      } else if (blockNumber === this.lastBlockNumber || blockNumber === 0) continue;
      else if (blockNumber - 1 !== this.lastBlockNumber) {
        this.logger.warn(
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

  private async indexBlock(hash: HexString) {
    const block = await this.api.derive.chain.getBlock(hash);
    const timestamp = (await this.api.blocks.getBlockTimestamp(block)).toNumber();

    await this.handleBlock(block, timestamp, hash);
    await this.handleExtrinsics(block, timestamp);
    await this.handleEvents(block, timestamp, hash);
  }

  eventHandlers: Record<EventNames, (data: any, timestamp?: number) => Promise<unknown>> = {
    [EventNames.UserMessageSent]: async (data: any, timestamp: number) => {
      const message = plainToInstance(Message, {
        ...data,
        genesis: this.genesis,
        timestamp: new Date(timestamp),
        type: MessageType.USER_MESS_SENT,
        program: await this.programRepository.get(data.source, this.genesis),
      });
      await this.messageService.createMessages([message]);
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
      try {
        const eventData = eventDataHandlers[method](data as GenericEventData);

        if (eventData === null) continue;

        eventData.blockHash = hash;
        await this.eventHandlers[method](eventData, timestamp);
      } catch (error) {
        this.logger.warn({ method, data: data.toHuman() });
        console.error(error);
      }
    }
  }

  private async handleExtrinsics(block: SignedBlockExtended, timestamp: number) {
    if (this.api === null) return;
    const status = this.api.createType('ExtrinsicStatus', { finalized: block.block.header.hash.toHex() });

    await this.handleCodeExtrinsics(block, status, timestamp);

    await this.handleProgramExtrinsics(block, status, timestamp);

    await this.handleMessageExtrinsics(block, status, timestamp);
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

      messages.push(
        plainToInstance(Message, {
          id: id.toHex(),
          destination: destination.toHex(),
          source: source.toHex(),
          payload,
          value,
          timestamp: new Date(timestamp),
          genesis: this.genesis,
          program: await this.programRepository.get(destination.toHex(), this.genesis),
          type: MessageType.ENQUEUED,
          entry: entry.isInit
            ? MessageEntryPoint.INIT
            : entry.isHandle
              ? MessageEntryPoint.HANDLE
              : MessageEntryPoint.REPLY,
        }),
      );

      await this.messageService.createMessages(messages);
    }
  }

  private async handleProgramExtrinsics(block: SignedBlockExtended, status: ExtrinsicStatus, timestamp: number) {
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
      let code = await this.codeRepository.get(codeId, this.genesis);

      if (!code) {
        this.logger.error(
          `Unable to retrieve code by id ${codeId} for program ${programId} encountered in block ${blockHash}`,
        );
        this.indexBlockWithMissedCode(codeId);
      }

      code = await this.codeRepository.get(codeId, this.genesis);

      if (!code) {
        this.logger.error(
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

    await this.programService.createPrograms(programs);
  }

  private async handleCodeExtrinsics(block: SignedBlockExtended, status: ExtrinsicStatus, timestamp: number) {
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

    await this.codeService.createCodes(codes);
  }

  private async handleBlock(block: SignedBlockExtended, timestamp: number, blockHash: HexString) {
    const blockNumber = block.block.header.number.toString() as string;
    await this.blockService.createBlocks([
      {
        hash: blockHash,
        numberBlockInNode: blockNumber,
        timestamp,
        genesis: this.genesis,
      },
    ]);
  }

  private async indexMissedBlock(number: number) {
    const hash = await this.api.blocks.getBlockHash(number);
    this.logger.log(`Index missed block ${number} with hash ${hash.toHex()}`);
    return this.indexBlock(hash.toHex());
  }

  private async indexBlockWithMissedCode(codeId: HexString) {
    const metaStorage = (await this.api.query.gearProgram.metadataStorage(codeId)) as Option<any>;
    if (metaStorage.isSome) {
      const blockNumber = metaStorage.unwrap()['blockNumber'].toNumber();

      return this.indexMissedBlock(blockNumber);
    }
    this.logger.error(`Code with hash ${codeId} not found in storage`);
  }
}
