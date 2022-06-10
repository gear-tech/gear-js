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

import { MessagesService } from 'src/messages/messages.service';
import { MetadataService } from 'src/metadata/metadata.service';
import { ProgramsService } from 'src/programs/programs.service';
import { Result } from './types';

import { FormResponse } from 'src/middleware/formResponse';

@Injectable()
export class ConsumerService {
  constructor(
    private readonly programService: ProgramsService,
    private readonly messageService: MessagesService,
    private readonly metaService: MetadataService,
  ) {}

  events = {
    UserMessageSent: (value: IUserMessageSentKafkaValue) => {
      this.messageService.save(value);
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
        await this.programService.save({
          id: destination,
          owner: source,
          genesis: genesis,
          timestamp: timestamp,
          blockHash: blockHash,
        });
      }
      this.messageService.save({
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
    MessageDispatched: (value: IMessagesDispatchedKafkaValue) => {
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
