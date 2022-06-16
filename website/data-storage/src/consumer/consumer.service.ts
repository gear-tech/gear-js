import { Injectable } from '@nestjs/common';
import {
  AddMetaParams,
  AddMetaResult,
  AddPayloadParams,
  AllMessagesResult,
  FindMessageParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
  GetAllUserProgramsParams,
  GetMessagesParams,
  GetMetaParams,
  GetMetaResult,
  IGenesis,
  IMessage,
  IMessageEnqueuedKafkaValue,
  IMessagesDispatchedKafkaValue,
  InitStatus,
  IProgramChangedKafkaValue,
  IUserMessageSentKafkaValue,
  ProgramDataResult,
} from '@gear-js/common';

import { Result } from './types';
import { ProgramService } from '../program/program.service';
import { MessageService } from '../message/message.service';
import { MetadataService } from '../metadata/metadata.service';
import { FormResponse } from '../middleware/formResponse';

@Injectable()
export class ConsumerService {
  constructor(
    private readonly programService: ProgramService,
    private readonly messageService: MessageService,
    private readonly metaService: MetadataService,
  ) {}

  events = {
    UserMessageSent: (value: IUserMessageSentKafkaValue) => {
      this.messageService.createMessage(value);
    },
    MessageEnqueued: async ({
      id,
      destination,
      source,
      entry,
      genesis,
      timestamp,
      blockHash,
    }: IMessageEnqueuedKafkaValue) => {
      if (entry === 'Init') {
        await this.programService.createProgram({
          id: destination,
          owner: source,
          genesis: genesis,
          timestamp: timestamp,
          blockHash: blockHash,
        });
      }
      await this.messageService.createMessage({
        id: id,
        destination: destination,
        source: source,
        payload: null,
        replyTo: null,
        replyError: null,
        genesis: genesis,
        blockHash: blockHash,
        timestamp: timestamp,
      });
    },
    ProgramChanged: (value: IProgramChangedKafkaValue) => {
      this.programService.setStatus(value.id, value.genesis, value.isActive ? InitStatus.SUCCESS : InitStatus.FAILED);
    },
    MessagesDispatched: (value: IMessagesDispatchedKafkaValue) => {
      this.messageService.setDispatchedStatus(value);
    },
    DatabaseWiped: (value: IGenesis) => {
      this.messageService.deleteRecords(value.genesis);
      this.programService.deleteRecords(value.genesis);
    },
  };

  @FormResponse
  async programData(params: FindProgramParams): Result<ProgramDataResult> {
    return await this.programService.findProgram(params);
  }

  @FormResponse
  async allPrograms(params: GetAllProgramsParams): Result<GetAllProgramsResult> {
    if (params.owner) {
      return await this.programService.getAllUserPrograms(params as GetAllUserProgramsParams);
    }
    return await this.programService.getAllPrograms(params);
  }

  @FormResponse
  async allUserPrograms(params: GetAllUserProgramsParams): Result<GetAllProgramsResult> {
    return await this.programService.getAllUserPrograms(params);
  }

  @FormResponse
  async addMeta(params: AddMetaParams): Result<AddMetaResult> {
    return await this.metaService.addMeta(params);
  }

  @FormResponse
  async getMeta(params: GetMetaParams): Result<GetMetaResult> {
    return await this.metaService.getMeta(params);
  }

  @FormResponse
  async addPayload(params: AddPayloadParams): Result<IMessage> {
    return await this.messageService.addPayload(params);
  }

  @FormResponse
  async allMessages(params: GetMessagesParams): Result<AllMessagesResult> {
    if (params.destination && params.source) {
      return await this.messageService.getAllMessages(params);
    }
    if (params.destination) {
      return await this.messageService.getIncoming(params);
    }
    return await this.messageService.getOutgoing(params);
  }

  @FormResponse
  async message(params: FindMessageParams): Result<IMessage> {
    return await this.messageService.getMessage(params);
  }
}
