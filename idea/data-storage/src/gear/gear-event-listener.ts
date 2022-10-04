import { Injectable, Logger } from '@nestjs/common';
import { CodeChangedData, GearApi, MessageEnqueuedData } from '@gear-js/api';
import { filterEvents } from '@polkadot/api/util';
import { GenericEventData } from '@polkadot/types';
import { Keys } from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { ProgramService } from '../program/program.service';
import { MessageService } from '../message/message.service';
import { CodeService } from '../code/code.service';
import { getPayloadByGearEvent, getUpdateMessageData } from '../common/helpers';
import { HandleExtrinsicsDataInput } from './types';
import { Code, Message, Program } from '../database/entities';
import { CodeStatus, MessageEntryPoint, MessageType, ProgramStatus } from '../common/enums';
import { CodeRepo } from '../code/code.repo';
import { UpdateCodeInput } from '../code/types';
import { changeStatus } from '../healthcheck/healthcheck.controller';
import { ProgramRepo } from '../program/program.repo';
import { CreateProgramInput } from '../program/types';
import configuration from '../config/configuration';
import { SERVICE_DATA } from '../common/service-data';
import { ProducerService } from '../producer/producer.service';

const { gear } = configuration();

@Injectable()
export class GearEventListener {
  private logger: Logger = new Logger('GearEventListener');
  private gearApi: GearApi;

  constructor(
    private programService: ProgramService,
    private programRepository: ProgramRepo,
    private messageService: MessageService,
    private codeService: CodeService,
    private codeRepository: CodeRepo,
    private producerService: ProducerService,
  ) {}

  public async listen() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await this.connectGearNode();
      const unsub = await this.listener();

      await this.producerService.getKafkaPartitionService();

      await new Promise((resolve) => {
        this.gearApi.on('error', (error) => {
          unsub();
          changeStatus('gearWSProvider');
          resolve(error);
        });
      });

      console.log('_________RECONNECTION_NODE__________');
    }
  }

  private async connectGearNode(): Promise<void>{
    try {
      this.gearApi = await GearApi.create({
        providerAddress: gear.wsProvider,
        throwOnConnect: true,
      });

      const chain = await this.gearApi.chain();
      const genesis = this.gearApi.genesisHash.toHex();

      this.logger.log(`⚙️ Connected to ${chain} with genesis ${genesis}`);

      SERVICE_DATA.genesis = genesis;

      changeStatus('gearWSProvider');
    } catch (error) {
      console.log('api.isReady', error);
    }
  }

  private async listener() {
    const gearApi = this.gearApi;
    const genesis = gearApi.genesisHash.toHex();

    return gearApi.query.system.events(async (events) => {
      const blockHash = events.createdAtHash!.toHex();

      const [blockTimestamp, block, extrinsicStatus] = await Promise.all([
        gearApi.blocks.getBlockTimestamp(blockHash),
        gearApi.blocks.get(blockHash),
        gearApi.createType('ExtrinsicStatus', { finalized: blockHash }),
      ]);

      const base = {
        genesis,
        blockHash,
        timestamp: blockTimestamp.toNumber(),
      };

      await this.handleExtrinsics({
        genesis,
        events,
        status: extrinsicStatus,
        signedBlock: block,
        timestamp: blockTimestamp.toNumber(),
        blockHash,
      });

      for (const { event: { data, method } } of events) {
        try {
          const payload = getPayloadByGearEvent(method, data as GenericEventData);
          if (payload !== null) {
            await this.handleEvents(method, { ...payload, ...base });
          }
        } catch (error) {
          console.error(error);
          this.logger.warn({ method, data: data.toHuman() });
          this.logger.error('_________END_ERROR_________');
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
      this.logger.error('_________HANDLE_EVENTS_ERROR_________');
      console.log(error);
    }
  }

  private async handleExtrinsics(handleExtrinsicsData: HandleExtrinsicsDataInput): Promise<void> {
    const { signedBlock, events, status, genesis, timestamp, blockHash } = handleExtrinsicsData;

    await this.createCodes(handleExtrinsicsData);
    await this.createPrograms(handleExtrinsicsData);

    const txMethods = ['sendMessage', 'uploadProgram', 'createProgram', 'sendReply'];
    const extrinsics = signedBlock.block.extrinsics.filter(({ method: { method } }) => txMethods.includes(method));

    for (const { hash, args, method: { method }, } of extrinsics) {
      let createMessagesDBType = [];

      const filteredEvents = filterEvents(hash, signedBlock, events, status).events!.find(
        ({ event: { method } }) => method === Keys.MessageEnqueued,
      );

      if (filteredEvents) {
        const eventData = filteredEvents.event.data as MessageEnqueuedData;

        const [payload, value] = getUpdateMessageData(args, method);

        const messageDBType = plainToClass(Message, {
          id: eventData.id.toHex(),
          destination: eventData.destination.toHex(),
          source: eventData.source.toHex(),
          entry: eventData.entry.isInit ? MessageEntryPoint.INIT : eventData.entry.isHandle
            ? MessageEntryPoint.HANDLE : MessageEntryPoint.REPLY,
          payload,
          value,
          timestamp: new Date(timestamp),
          genesis,
          program: await this.programRepository.get(eventData.destination.toHex()),
        });

        createMessagesDBType = [...createMessagesDBType, messageDBType];
      }

      try {
        if (createMessagesDBType.length >= 1) await this.messageService.createMessages(createMessagesDBType);
      } catch (error) {
        this.logger.error('_________HANDLE_EXTRINSICS_ERROR_________');
        console.log(error);
      }
    }
  }

  private async createPrograms(handleExtrinsicsData: HandleExtrinsicsDataInput): Promise<Program[]> {
    const { signedBlock, events, status, genesis, timestamp, blockHash } = handleExtrinsicsData;

    const extrinsics = signedBlock.block.extrinsics.filter(({ method: { method } }) =>
      ['uploadProgram', 'createProgram'].includes(method),
    );
    let createProgramsInput = [];

    for (const extrinsic of extrinsics) {
      const filteredEvents = filterEvents(extrinsic.hash, signedBlock, events, status).events!.find(
        ({ event: { method } }) => method === Keys.MessageEnqueued,
      );

      if (filteredEvents) {
        const { source, destination } = filteredEvents.event.data as MessageEnqueuedData;
        let code;

        try {
          const codeId = await this.gearApi.program.codeHash(destination.toHex());
          code = await this.codeRepository.get(codeId);
        } catch (error) {
          console.log('_________CODE_NOT_EXISTED_ERROR_________');
          console.log('_________CODE_DESTINATION>', destination.toHex());
          code = null;
        }

        const createProgramInput: CreateProgramInput = {
          id: destination.toHex(),
          owner: source.toHex(),
          genesis,
          timestamp,
          blockHash,
          code
        };

        createProgramsInput = [...createProgramsInput, createProgramInput];
      }
    }

    try {
      return this.programService.createPrograms(createProgramsInput);
    } catch (error) {
      this.logger.error('_________CREATE_PROGRAMS_ERROR_________');
      console.log(error);
    }

  }

  private async createCodes(handleExtrinsicsData: HandleExtrinsicsDataInput): Promise<Code[]> {
    const { signedBlock, events, status, genesis, timestamp, blockHash } = handleExtrinsicsData;

    const extrinsics = signedBlock.block.extrinsics.filter(({ method: { method } }) =>
      ['uploadCode', 'uploadProgram'].includes(method),
    );
    let updateCodesInput = [];

    for (const extrinsic of extrinsics) {
      const filteredEvents = filterEvents(extrinsic.hash, signedBlock, events, status).events!.find(
        ({ event: { method } }) => method === Keys.CodeChanged,
      );

      if (filteredEvents) {
        const { change, id } = filteredEvents.event.data as CodeChangedData;

        const updateCodeInput: UpdateCodeInput = {
          id: id.toHex(),
          genesis,
          status: change.isActive ? CodeStatus.ACTIVE : change.isInactive ? CodeStatus.INACTIVE : null,
          timestamp,
          blockHash,
          expiration: change.isActive ? (change.asActive.expiration.toHuman() as number) : null,
        };

        updateCodesInput = [...updateCodesInput, updateCodeInput];
      }
    }

    try {
      return this.codeService.updateCodes(updateCodesInput);
    } catch (error){
      this.logger.error('_________CREATE_CODES_ERROR__________');
      console.log(error);
    }
  }
}
