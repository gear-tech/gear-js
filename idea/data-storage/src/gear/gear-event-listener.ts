import { Injectable, Logger } from '@nestjs/common';
import { CodeChangedData, MessageEnqueuedData } from '@gear-js/api';
import { filterEvents } from '@polkadot/api/util';
import { GenericEventData } from '@polkadot/types';
import { Keys } from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { gearService } from './gear-service';
import { ProgramService } from '../program/program.service';
import { MessageService } from '../message/message.service';
import { MetadataService } from '../metadata/metadata.service';
import { CodeService } from '../code/code.service';
import { getPayloadByGearEvent, getUpdateMessageData } from '../common/helpers';
import { CreateProgramByExtrinsicInput, HandleExtrinsicsDataInput } from './types';
import { Message, Program } from '../database/entities';
import { CodeStatus, MessageEntryPoing, MessageType, ProgramStatus } from '../common/enums';
import { CodeRepo } from '../code/code.repo';
import { UpdateCodeInput } from '../code/types';
import { changeStatus } from '../healthcheck/healthcheck.controller';


@Injectable()
export class GearEventListener {
  private logger: Logger = new Logger('GearEventListener');

  constructor(private programService: ProgramService,
              private messageService: MessageService,
              private metaService: MetadataService,
              private codeService: CodeService,
              private codeRepository: CodeRepo) {}

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
          if (payload !== null && payload !== undefined) {
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
    const { id, genesis } = payload;

    const eventsMethod = {
      [Keys.UserMessageSent]: async () => {
        const createMessageDBType = plainToClass(Message, {
          ...payload,
          type: MessageType.USER_MESS_SENT
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
      }
    };

    try {
      method in eventsMethod && await eventsMethod[method]();
    } catch (error) {
      console.log(error);
      this.logger.error(error);
    }
  }

  private async handleExtrinsics(handleExtrinsicsData: HandleExtrinsicsDataInput): Promise<void> {
    const { signedBlock, events, status, genesis, timestamp, blockHash } = handleExtrinsicsData;

    await this.uploadCodeByExtrinsic(handleExtrinsicsData);

    const eventMethods = ['sendMessage', 'uploadProgram', 'createProgram', 'sendReply'];
    const extrinsics = signedBlock.block.extrinsics.filter(({ method: { method } }) => eventMethods.includes(method));
    let createMessagesDBType = [];

    for (const extrinsic of extrinsics) {
      const { hash, args, method: { method } } = extrinsic;

      const filteredEvents = filterEvents(hash, signedBlock, events, status).events!.filter(
        ({ event: { method } }) => method === Keys.MessageEnqueued,
      );

      const eventData = filteredEvents[0].event.data as MessageEnqueuedData;

      const [payload, value] = getUpdateMessageData(args, method);
      const creatProgramByExtrinsicMethod: CreateProgramByExtrinsicInput = {
        eventData,
        genesis,
        timestamp,
        blockHash
      };

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
        program: await this.createProgramByExtrinsic(method, creatProgramByExtrinsicMethod),
      });

      createMessagesDBType = [...createMessagesDBType, messageDBType];
    }

    try {
      if (createMessagesDBType.length >= 1) await this.messageService.createMessages(createMessagesDBType);
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async createProgramByExtrinsic(
    method: string, createProgramByExtrinsicInput: CreateProgramByExtrinsicInput,
  ): Promise<Program | null> {
    if (!['uploadProgram', 'createProgram'].includes(method)) {
      return null;
    }

    const { eventData, timestamp, blockHash, genesis } = createProgramByExtrinsicInput;

    const codeHash = await gearService.getApi().program.codeHash(eventData.destination.toHex());

    const code = await this.codeRepository.get(codeHash);

    return this.programService.createProgram({
      id: eventData.destination.toHex(),
      owner: eventData.source.toHex(),
      genesis,
      timestamp,
      blockHash,
      code,
    });
  }

  private async uploadCodeByExtrinsic(handleExtrinsicsData: HandleExtrinsicsDataInput): Promise<void> {
    const { signedBlock, events, status, genesis, timestamp, blockHash } = handleExtrinsicsData;

    const extrinsic = signedBlock.block.extrinsics.find(({ method: { method } }) => method === 'uploadCode');

    if (extrinsic){
      const filteredEvents = filterEvents(extrinsic.hash, signedBlock, events, status).events!.filter(
        ({ event: { method } }) => method === Keys.CodeChanged,
      );

      const {  change, id  } = filteredEvents[0].event.data as CodeChangedData;

      const updateCodeInput: UpdateCodeInput = {
        id: id.toHex(),
        genesis,
        status: change.isActive ? CodeStatus.ACTIVE : change.isInactive ? CodeStatus.INACTIVE : null,
        timestamp,
        blockHash,
        expiration:  change.isActive ? change.asActive.expiration.toHuman() as number : null,
      };

      await this.codeService.updateCode(updateCodeInput);
    }
  }
}
