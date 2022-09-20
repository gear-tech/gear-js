import { Injectable, Logger } from '@nestjs/common';
import { CodeChangedData, MessageEnqueuedData } from '@gear-js/api';
import { filterEvents } from '@polkadot/api/util';
import { GenericEventData } from '@polkadot/types';
import { Keys } from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { gearService } from './gear-service';
import { ProgramService } from '../program/program.service';
import { MessageService } from '../message/message.service';
import { CodeService } from '../code/code.service';
import { getPayloadByGearEvent, getUpdateMessageData } from '../common/helpers';
import { HandleExtrinsicsDataInput } from './types';
import { Code, Message, Program } from '../database/entities';
import { CodeStatus, MessageEntryPoing, MessageType, ProgramStatus } from '../common/enums';
import { CodeRepo } from '../code/code.repo';
import { UpdateCodeInput } from '../code/types';
import { changeStatus } from '../healthcheck/healthcheck.controller';
import { ProgramRepo } from '../program/program.repo';
import { CreateProgramInput } from '../program/types';

@Injectable()
export class GearEventListener {
  private logger: Logger = new Logger('GearEventListener');

  constructor(
    private programService: ProgramService,
    private programRepository: ProgramRepo,
    private messageService: MessageService,
    private codeService: CodeService,
    private codeRepository: CodeRepo,
  ) {}

  public async listen() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const unsub = await this.listener();

      return new Promise((resolve) => {
        gearService.getApi().on('error', (error) => {
          unsub();
          changeStatus('gearWSProvider');
          resolve(error);
        });
      });
    }
  }

  private async listener() {
    const gearApi = gearService.getApi();
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
          this.logger.error('--------------END_ERROR--------------');
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
      console.log('______________HANDLE_EVENTS_ERROR______________');
      console.log(error);
      this.logger.error(error);
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
          entry: eventData.entry.isInit ? MessageEntryPoing.INIT : eventData.entry.isHandle
            ? MessageEntryPoing.HANDLE : MessageEntryPoing.REPLY,
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
        this.logger.error(error);
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
          const codeId = await gearService.getApi().program.codeHash(destination.toHex());
          code = await this.codeRepository.get(codeId);
        } catch (error) {
          console.log('_______________CODE_NOT_EXISTED_ERROR______________');
          console.log('_______________CODE_DESTINATION>', destination.toHex());
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
      console.log('______________CREATE_PROGRAMS_ERROR______________');
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
      console.log('______________CREATE_CODES_ERROR______________');
      this.logger.error(error);
      console.log(error);
    }
  }
}
