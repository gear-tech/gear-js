import { Injectable, Logger } from '@nestjs/common';
import { CodeChanged, GearApi, generateCodeHash, MessageQueued } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { filterEvents } from '@polkadot/api/util';
import { GenericEventData } from '@polkadot/types';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { SignedBlockExtended } from '@polkadot/api-derive/types';
import { Keys } from '@gear-js/common';
import { plainToInstance } from 'class-transformer';

import { ProgramService } from '../program/program.service';
import { MessageService } from '../message/message.service';
import { CodeService } from '../code/code.service';
import { getExtrinsics, getMetaHash, getPayloadAndValue, getPayloadByGearEvent } from '../common/helpers';
import { Code, Message, Program } from '../database/entities';
import { CodeStatus, MessageEntryPoint, MessageType } from '../common/enums';
import { CodeRepo } from '../code/code.repo';
import { CodeChangedInput } from '../code/types';
import { changeStatus } from '../healthcheck/healthcheck.controller';
import { ProgramRepo } from '../program/program.repo';
import configuration from '../config/configuration';
import { BlockService } from '../block/block.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { MetaService } from '../meta/meta.service';
import { VoidFn } from '@polkadot/api/types';

const { gear } = configuration();

const MAX_RECCONECTIONS = 10;
let reconnectionsCounter = 0;

@Injectable()
export class GearService {
  private logger: Logger = new Logger(GearService.name);
  public api: GearApi;
  public genesis: HexString;
  private unsub: VoidFn;

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
    this.unsub && this.unsub();
    if (this.api) {
      await this.api.disconnect();
      this.api === null;
    }
    reconnectionsCounter++;
    if (reconnectionsCounter > MAX_RECCONECTIONS) {
      throw new Error(`Unable to connect to ${gear.wsProvider}`);
    }
    this.logger.log('⚙️ 📡 Reconnecting to the gear node');
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
    this.rabbitMQService.deleteGenesisQ(this.genesis);
    changeStatus('gear');
    return this.connect();
  }

  private async connect(): Promise<void> {
    this.api = new GearApi({ providerAddress: gear.wsProvider });
    try {
      await this.api.isReadyOrError;
    } catch (e) {
      this.logger.error(`Failed to connect to ${gear.wsProvider}`);
    }
    await this.api.isReady;
    this.api.on('disconnected', () => {
      this.reconnect();
    });

    this.genesis = this.api.genesisHash.toHex();
    this.rabbitMQService.addGenesisQ(this.genesis);
    this.logger.log(`⚙️ Connected to ${this.api.runtimeChain} with genesis ${this.genesis}`);
    reconnectionsCounter = 0;
    this.unsub = await this.listen();
    changeStatus('gear');
  }

  private async listen() {
    return this.api.derive.chain.subscribeNewBlocks(async (block) => {
      const blockHash = block.block.hash.toHex();
      const timestamp = (await this.api.blocks.getBlockTimestamp(block)).toNumber();

      await this.handleBlock(block, timestamp, blockHash);
      await this.handleExtrinsics(block, timestamp);

      for (const {
        event: { data, method },
      } of block.events) {
        try {
          const payload = getPayloadByGearEvent(method, data as GenericEventData);
          if (payload !== null) {
            await this.handleEvents(method, { ...payload, blockHash, timestamp, genesis: this.genesis });
          }
        } catch (error) {
          console.error(error);
          this.logger.warn({ method, data: data.toHuman() });
        }
      }
    });
  }

  private async handleEvents(method: string, payload: any): Promise<void> {
    const { id, genesis, timestamp } = payload;

    const eventsMethod = {
      [Keys.UserMessageSent]: async () => {
        const createMessageDBType = plainToInstance(Message, {
          ...payload,
          timestamp: new Date(timestamp),
          type: MessageType.USER_MESS_SENT,
          program: await this.programRepository.get(payload.source, genesis),
        });
        await this.messageService.createMessages([createMessageDBType]);
      },
      [Keys.ProgramChanged]: async () => {
        await this.programService.setStatus(id, genesis, payload.programStatus);
      },
      [Keys.MessagesDispatched]: async () => {
        await this.messageService.setDispatchedStatus(payload);
      },
      [Keys.UserMessageRead]: async () => {
        await this.messageService.updateReadStatus(id, payload.reason);
      },
      [Keys.CodeChanged]: async () => {
        const codeChangedInput: CodeChangedInput = { ...payload };
        await this.codeService.updateCodes([codeChangedInput]);
      },
      [Keys.DatabaseWiped]: async () => {
        await this.messageService.deleteRecords(genesis);
        await this.programService.deleteRecords(genesis);
        await this.codeService.deleteRecords(genesis);
      },
    };

    try {
      method in eventsMethod && (await eventsMethod[method]());
    } catch (error) {
      this.logger.error('Handle events error');
      console.log(error);
    }
  }

  private async handleExtrinsics(block: SignedBlockExtended, timestamp: number) {
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
      let code: Code;
      try {
        code = await this.codeRepository.get(codeId, this.genesis);
      } catch (e) {
        this.logger.error(
          `Unable to retrieve code by id ${codeId} for program ${programId} encountered in block ${blockHash}`,
        );
        // TODO it's necessary to have ability to get code info even if it was missed for some reason
        continue;
      }

      programs.push(
        plainToInstance(Program, {
          id: programId,
          name: programId,
          owner,
          blockHash,
          timestamp: new Date(timestamp),
          code,
          genesis: this.genesis,
          meta: code.meta,
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
      const metaHash = await getMetaHash(this.api.code, codeId);

      const codeStatus = change.isActive ? CodeStatus.ACTIVE : change.isInactive ? CodeStatus.INACTIVE : null;
      const meta = metaHash ? await this.metaService.getByHashOrCreate(metaHash) : null;

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
}
