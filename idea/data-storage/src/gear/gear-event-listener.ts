import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { CodeChanged, GearApi, generateCodeHash, MessageQueued } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { filterEvents } from '@polkadot/api/util';
import { GenericEventData } from '@polkadot/types';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { SignedBlockExtended } from '@polkadot/api-derive/types';
import { Keys } from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { ProgramService } from '../program/program.service';
import { MessageService } from '../message/message.service';
import { CodeService } from '../code/code.service';
import { getMetaHash, getPayloadAndValue, getPayloadByGearEvent } from '../common/helpers';
import { Message } from '../database/entities';
import { CodeStatus, MessageEntryPoint, MessageType } from '../common/enums';
import { CodeRepo } from '../code/code.repo';
import { CodeChangedInput, UpdateCodeInput } from '../code/types';
import { changeStatus } from '../healthcheck/healthcheck.controller';
import { ProgramRepo } from '../program/program.repo';
import { CreateProgramInput } from '../program/types';
import configuration from '../config/configuration';
import { BlockService } from '../block/block.service';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { MetaService } from '../meta/meta.service';

const { gear } = configuration();

@Injectable()
export class GearEventListener {
  private logger: Logger = new Logger(GearEventListener.name);
  public api: GearApi;
  public genesis: HexString;

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
        this.api.on('error', async (error) => {
          await this.rabbitMQService.sendDeleteGenesis(this.genesis);
          changeStatus('gear');
          unsub();
          resolve(error);
        });
      });

      this.logger.log('⚙️ 📡 Reconnecting to the gear node');
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

      console.log('_____>createMessages', messages);
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
          this.api.events.gear.MessageQueued.is(event),
        );

        if (!foundEvent) {
          continue;
        }

        const {
          data: { source, destination },
        } = foundEvent.event as MessageQueued;

        const codeId = tx.method.method === 'uploadProgram' ? generateCodeHash(tx.args[0].toHex()) : tx.args[0].toHex();
        const code = await this.codeRepository.get(codeId, this.genesis);
        const createProgramInput: CreateProgramInput = {
          owner: source.toHex(),
          id: destination.toHex(),
          blockHash: block.createdAtHash.toHex(),
          timestamp,
          code,
          genesis: this.genesis,
        };

        if (code && code['meta'] !== null) {
          createProgramInput.meta = code.meta;
        }

        programs.push(createProgramInput);
      }

      console.log('_____>createPrograms', programs);
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

        if (!event) return;

        const {
          data: { id },
        } = event.event as CodeChanged;
        const codeId = event ? id.toHex() : generateCodeHash(tx.args[0].toHex());
        const metaHash = await getMetaHash(this.api.code, codeId);

        if (event) {
          const {
            data: { change },
          } = event.event as CodeChanged;
          const codeStatus = change.isActive ? CodeStatus.ACTIVE : change.isInactive ? CodeStatus.INACTIVE : null;
          const updateCodeInput = {
            id: codeId,
            genesis: this.genesis,
            status: codeStatus,
            timestamp,
            blockHash: block.createdAtHash.toHex(),
            expiration: change.isActive ? change.asActive.expiration.toString() : null,
            uploadedBy: tx.signer.inner.toHex(),
            meta: null,
          };

          if (metaHash) {
            updateCodeInput.meta = await this.metaService.getByHashOrCreate(metaHash);
          }

          codes.push(updateCodeInput);
        }
      }

      console.log('_____>updateCodes', codes);
      await this.codeService.updateCodes(codes);
    }
  }

  private async handleBlocks(block: SignedBlockExtended, timestamp: number, blockHash: HexString) {
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
