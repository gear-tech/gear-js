import { Injectable } from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';
import { MetadataService } from 'src/metadata/metadata.service';
import { ProgramsService } from 'src/programs/programs.service';
import { Result } from './types';
import {
  AddMetaParams,
  AddMetaResult,
  AddPayloadParams,
  AllMessagesResult,
  FindMessageParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
  GetMessagesParams,
  GetMetaParams,
  GetMetaResult,
  IMessage,
  IProgram,
  MessageDispatched,
  InitStatus,
  Log,
  InitMessageEnqueued,
  DispatchMessageEnqueud,
  InitSuccess,
  InitFailure,
  GetAllUserProgramsParams,
  IGenesis,
} from '@gear-js/interfaces';
import { FormResponse } from 'src/middleware/formResponse';

@Injectable()
export class ConsumerService {
  constructor(
    private readonly programService: ProgramsService,
    private readonly messageService: MessagesService,
    private readonly metaService: MetadataService,
  ) {}

  events = {
    Log: (value: Log) => {
      this.messageService.save(value);
    },
    InitMessageEnqueued: async (value: InitMessageEnqueued) => {
      await this.programService.save({
        id: value.programId,
        owner: value.origin,
        genesis: value.genesis,
        timestamp: value.timestamp,
        blockHash: value.blockHash,
      });
      this.messageService.save({
        id: value.messageId,
        destination: value.programId,
        source: value.origin,
        payload: null,
        replyTo: null,
        replyError: null,
        genesis: value.genesis,
        blockHash: value.blockHash,
        timestamp: value.timestamp,
      });
    },
    DispatchMessageEnqueued: (value: DispatchMessageEnqueud) => {
      this.messageService.save({
        genesis: value.genesis,
        id: value.messageId,
        destination: value.programId,
        source: value.origin,
        blockHash: value.blockHash,
        timestamp: value.timestamp,
        payload: null,
        replyTo: null,
        replyError: null,
      });
    },
    InitSuccess: (value: InitSuccess) => {
      this.programService.setStatus(value.programId, value.genesis, InitStatus.SUCCESS);
    },
    InitFailure: (value: InitFailure) => {
      this.programService.setStatus(value.programId, value.genesis, InitStatus.FAILED);
    },
    MessageDispatched: (value: MessageDispatched) => {
      this.messageService.setDispatchedStatus(value);
    },
    DatabaseWiped: (value: IGenesis) => {
      this.messageService.deleteRecords(value.genesis);
      this.programService.deleteRecords(value.genesis);
    },
  };

  @FormResponse
  async programData(params: FindProgramParams): Result<IProgram> {
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
