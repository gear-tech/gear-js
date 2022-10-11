import { Injectable, Logger } from '@nestjs/common';
import { CodeChanged, GearApi, Hex, MessageEnqueued, MessageEnqueuedData } from '@gear-js/api';
import { filterEvents } from '@polkadot/api/util';
import { GenericEventData } from '@polkadot/types';
import { ExtrinsicStatus } from '@polkadot/types/interfaces';
import { SignedBlockExtended } from '@polkadot/api-derive/types';
import { Keys } from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { ProgramService } from '../program/program.service';
import { MessageService } from '../message/message.service';
import { CodeService } from '../code/code.service';
import { getPayloadByGearEvent, getPayloadAndValue } from '../common/helpers';
import { Message } from '../database/entities';
import { CodeStatus, MessageEntryPoint, MessageType, ProgramStatus } from '../common/enums';
import { CodeRepo } from '../code/code.repo';
import { CodeChangedInput, UpdateCodeInput } from '../code/types';
import { changeStatus } from '../healthcheck/healthcheck.controller';
import { ProgramRepo } from '../program/program.repo';
import { CreateProgramInput } from '../program/types';
import configuration from '../config/configuration';
import { KafkaNetworkData } from '../common/kafka-network-data';
import { ProducerService } from '../producer/producer.service';

const { gear } = configuration();

@Injectable()
export class GearEventListener {
  private logger: Logger = new Logger(GearEventListener.name);
  private api: GearApi;
  private genesis: Hex;

  constructor(
    private programService: ProgramService,
    private programRepository: ProgramRepo,
    private messageService: MessageService,
    private codeService: CodeService,
    private codeRepository: CodeRepo,
    private producerService: ProducerService,
  ) {}

  public async run() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await this.connectGearNode();
      const unsub = await this.listen();

      await this.producerService.setKafkaNetworkData();

      await new Promise((resolve) => {
        this.api.on('error', (error) => {
          unsub();
          changeStatus('gearWSProvider');
          resolve(error);
        });
      });

      this.logger.log('⚙️ 📡 Reconnection node');
    }
  }

  private async connectGearNode(): Promise<void> {
    try {
      this.api = await GearApi.create({
        providerAddress: gear.wsProvider,
        throwOnConnect: true,
      });

      this.genesis = this.api.genesisHash.toHex();

      this.logger.log(`⚙️ Connected to ${this.api.runtimeChain} with genesis ${this.genesis}`);

      KafkaNetworkData.genesis = this.genesis;

      changeStatus('gearWSProvider');
    } catch (error) {
      console.log('api.isReady', error);
    }
  }

  private listen() {
    return this.api.derive.chain.subscribeNewBlocks(async (block) => {
      const blockHash = block.createdAtHash.toHex();
      const timestamp = (await this.api.blocks.getBlockTimestamp(block)).toNumber();

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
        await Promise.all([
          this.messageService.deleteRecords(genesis),
          this.programService.deleteRecords(genesis),
          this.codeService.deleteRecords(genesis),
        ]);
      },
    };

    try {
      method in eventsMethod && (await eventsMethod[method]());
    } catch (error) {
      this.logger.error('Handle events error');
      console.log(error);
    }
  }

  private async handleExtrinsics(block: SignedBlockExtended, ts: number) {
    const status = this.api.createType('ExtrinsicStatus', { finalized: block.createdAtHash });

    await this.handleCodeExtrinsics(block, status, ts);

    await this.handleProgramExtrinsics(block, status, ts);

    await this.handleMessageExtrinsics(block, status, ts);
  }

  private async handleMessageExtrinsics(block: SignedBlockExtended, status: ExtrinsicStatus, timestamp: number) {
    const txMethods = ['sendMessage', 'sendReply', 'uploadProgram', 'createProgram'];
    const extrinsics = block.block.extrinsics.filter(({ method: { method } }) => txMethods.includes(method));
    const messages: Message[] = [];

    if (extrinsics.length >= 1) {

      for (const tx of extrinsics) {
        const {
          data: { id, source, destination, entry },
        } = filterEvents(tx.hash, block, block.events, status).events.find(({ event }) =>
          this.api.events.gear.MessageEnqueued.is(event),
        ).event as MessageEnqueued;

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
    }

    if(messages.length >= 1) await this.messageService.createMessages(messages);
  }

  private async handleProgramExtrinsics(block: SignedBlockExtended, status: ExtrinsicStatus, timestamp: number) {
    const txMethods = ['uploadProgram', 'createProgram'];
    const extrinsics = block.block.extrinsics.filter(({ method: { method } }) => txMethods.includes(method));
    const programs: CreateProgramInput[] = [];

    if (extrinsics.length >= 1)  {
      for (const tx of extrinsics) {
        const {
          data: { source, destination },
        } = filterEvents(tx.hash, block, block.events, status).events.find(({ event }) =>
          this.api.events.gear.MessageEnqueued.is(event),
        ).event as MessageEnqueued;

        let code;

        try {
          const codeId = await this.api.program.codeHash(destination.toHex());
          code = await this.codeRepository.get(codeId, this.genesis);
        } catch (error) {
          this.logger.error('Code not exists error');
          console.log('Code destination', destination.toHex());
          code = null;
        }

        programs.push({
          owner: source.toHex(),
          id: destination.toHex(),
          blockHash: block.createdAtHash.toHex(),
          timestamp,
          code,
          genesis: this.genesis,
        });
      }
    }

    if(programs.length >= 1) await this.programService.createPrograms(programs);
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
          const { data: { id, change } } = event.event as CodeChanged;

          const codeStatus = change.isActive ? CodeStatus.ACTIVE : change.isInactive ? CodeStatus.INACTIVE : null;

          codes.push({
            id: id.toHex(),
            genesis: this.genesis,
            status: codeStatus,
            timestamp,
            blockHash: block.createdAtHash.toHex(),
            expiration: change.isActive ? change.asActive.expiration.toString() : null,
          });
        }
      }
    }

    if(codes.length >= 1) await this.codeService.updateCodes(codes);
  }
}
