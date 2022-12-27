import { Injectable, Logger } from '@nestjs/common';
import { CodeChanged, GearApi, generateCodeHash, Hex, MessageEnqueued } from '@gear-js/api';
import { filterEvents } from '@polkadot/api/util';
import { GenericEventData } from '@polkadot/types';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { SignedBlockExtended } from '@polkadot/api-derive/types';
import { Keys } from '@gear-js/common';
import { plainToClass } from 'class-transformer';
import { blake2AsHex } from '@polkadot/util-crypto';

import { ProgramService } from '../program/program.service';
import { MessageService } from '../message/message.service';
import { CodeService } from '../code/code.service';
import { getPayloadAndValue, getPayloadByGearEvent } from '../common/helpers';
import { Message } from '../database/entities';
import { CodeStatus, MessageEntryPoint, MessageType, ProgramStatus } from '../common/enums';
import { CodeRepo } from '../code/code.repo';
import { CodeChangedInput, UpdateCodeInput } from '../code/types';
import { changeStatus } from '../healthcheck/healthcheck.controller';
import { ProgramRepo } from '../program/program.repo';
import { CreateProgramInput } from '../program/types';
import configuration from '../config/configuration';
import { BlockService } from '../block/block.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

const { gear } = configuration();

@Injectable()
export class GearEventListener {
  private logger: Logger = new Logger(GearEventListener.name);
  private api: GearApi;
  public genesis: Hex;

  constructor(
    private programService: ProgramService,
    private programRepository: ProgramRepo,
    private messageService: MessageService,
    private codeService: CodeService,
    private codeRepository: CodeRepo,
    private blockService: BlockService,
    private rabbitMQService: RabbitmqService,
  ) {}

  public async run() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        await this.connectGearNode();
        await this.rabbitMQService.initRMQ(this.genesis);
      } catch (error) {
        this.logger.log('⚙️ 📡 Reconnecting to the gear node');
        continue;
      }
      const unsub = await this.listen();

      await new Promise((resolve) => {
        this.api.on('error',  async (error) => {
          await this.rabbitMQService.sendDeleteGenesis(this.genesis);
          changeStatus('gear');
          unsub();
          resolve(error);
        });
      });

      this.logger.log('⚙️ 📡 Reconnecting to the gear node');
    }
  }

  public async isValidMetaHex(hex: string, programId: string): Promise<boolean> {
    try {
      const metaHash = await this.api.program.metaHash(programId as Hex);
      return metaHash === blake2AsHex(hex, 256);
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  private async connectGearNode(): Promise<void> {
    this.api = await GearApi.create({
      providerAddress: gear.wsProvider,
      throwOnConnect: true,
    });

    this.genesis = this.api.genesisHash.toHex();

    this.logger.log(`⚙️ Connected to ${this.api.runtimeChain} with genesis ${this.genesis}`);

    changeStatus('gear');
  }

  private listen() {
    return this.api.derive.chain.subscribeFinalizedHeads(async (head) => {
      const blockHash = head.createdAtHash.toHex();

      const block = await this.api.derive.chain.getBlock(blockHash);

      const timestamp = (await this.api.blocks.getBlockTimestamp(block)).toNumber();

      await this.handleBlocks(block, timestamp, blockHash);
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
        const createMessageDBType = plainToClass(Message, {
          ...payload,
          timestamp: new Date(timestamp),
          type: MessageType.USER_MESS_SENT,
          program: await this.programRepository.get(payload.source, genesis),
        });
        await this.messageService.createMessages([createMessageDBType]);
      },
      [Keys.ProgramChanged]: async () => {
        if (payload.isActive) await this.programService.setStatus(id, genesis, ProgramStatus.ACTIVE);
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
    const status = this.api.createType('ExtrinsicStatus', { finalized: block.createdAtHash });

    await this.handleCodeExtrinsics(block, status, timestamp);

    await this.handleProgramExtrinsics(block, status, timestamp);

    await this.handleMessageExtrinsics(block, status, timestamp);
  }

  private async handleMessageExtrinsics(block: SignedBlockExtended, status: ExtrinsicStatus, timestamp: number) {
    const txMethods = ['sendMessage', 'sendReply', 'uploadProgram', 'createProgram'];
    const extrinsics = block.block.extrinsics.filter(({ method: { method } }) => txMethods.includes(method));
    const messages: Message[] = [];

    if (extrinsics.length >= 1) {
      for (const tx of extrinsics) {
        const foundEvent = filterEvents(tx.hash, block, block.events, status).events.find(({ event }) =>
          this.api.events.gear.MessageEnqueued.is(event),
        );

        if (!foundEvent) {
          continue;
        }

        const {
          data: { id, source, destination, entry },
        } = foundEvent.event as MessageEnqueued;

        const [payload, value] = getPayloadAndValue(tx.args, tx.method.method);

        messages.push(
          plainToClass(Message, {
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
      }

      await this.messageService.createMessages(messages);
    }
  }

  private async handleProgramExtrinsics(block: SignedBlockExtended, status: ExtrinsicStatus, timestamp: number) {
    const txMethods = ['uploadProgram', 'createProgram'];
    const extrinsics = block.block.extrinsics.filter(({ method: { method } }) => txMethods.includes(method));
    const programs: CreateProgramInput[] = [];

    if (extrinsics.length >= 1) {
      for (const tx of extrinsics) {
        const foundEvent = filterEvents(tx.hash, block, block.events, status).events.find(({ event }) =>
          this.api.events.gear.MessageEnqueued.is(event),
        );

        if (!foundEvent) {
          continue;
        }

        const {
          data: { source, destination },
        } = foundEvent.event as MessageEnqueued;

        const codeId = tx.method.method === 'uploadProgram' ? generateCodeHash(tx.args[0].toHex()) : tx.args[0].toHex();

        programs.push({
          owner: source.toHex(),
          id: destination.toHex(),
          blockHash: block.createdAtHash.toHex(),
          timestamp,
          code: await this.codeRepository.get(codeId, this.genesis),
          genesis: this.genesis,
        });
      }
      await this.programService.createPrograms(programs);
    }
  }

  private async handleCodeExtrinsics(block: SignedBlockExtended, status: ExtrinsicStatus, timestamp: number) {
    const txMethods = ['uploadProgram', 'uploadCode'];
    const extrinsics = block.block.extrinsics.filter(({ method: { method } }) => txMethods.includes(method));
    const codes: UpdateCodeInput[] = [];

    if (extrinsics.length >= 1) {
      for (const tx of extrinsics) {
        const event = filterEvents(tx.hash, block, block.events, status).events.find(({ event }) =>
          this.api.events.gear.CodeChanged.is(event),
        );

        if (event) {
          const {
            data: { id, change },
          } = event.event as CodeChanged;
          const codeStatus = change.isActive ? CodeStatus.ACTIVE : change.isInactive ? CodeStatus.INACTIVE : null;

          codes.push({
            id: id.toHex(),
            genesis: this.genesis,
            status: codeStatus,
            timestamp,
            blockHash: block.createdAtHash.toHex(),
            expiration: change.isActive ? change.asActive.expiration.toString() : null,
            uploadedBy: tx.signer.inner.toHex(),
          });
        } else {
          const codeId = generateCodeHash(tx.args[0].toHex());
          const code = await this.codeRepository.get(codeId, this.genesis);

          if (!code) {
            codes.push({
              id: codeId,
              genesis: this.genesis,
              status: CodeStatus.ACTIVE,
              timestamp,
              blockHash: block.createdAtHash.toHex(),
              expiration: null,
              uploadedBy: tx.signer.inner.toHex(),
            });
          }
        }
      }

      await this.codeService.updateCodes(codes);
    }
  }

  private async handleBlocks(block: SignedBlockExtended, timestamp: number, blockHash: Hex) {
    const blockNumber = block.block.header.toHuman().number as string;

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
