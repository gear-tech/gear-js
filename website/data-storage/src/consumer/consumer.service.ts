import { Injectable } from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';
import { MetadataService } from 'src/metadata/metadata.service';
import { ProgramsService } from 'src/programs/programs.service';
import { Result } from './types';
import { ProgramNotFound } from 'src/errors';
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
} from '@gear-js/interfaces';
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
        payload: void null,
        replyTo: void null,
        replyError: void null,
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
        payload: void null,
        replyTo: void null,
        replyError: void null,
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
    DatabaseWiped: () => {
      throw new TypeError('unexpected `DatabaseWiped` event');
    },
  };

  async programData(params: FindProgramParams): Result<IProgram> {
    const found = await this.programService.findProgram(params).catch(({ message }) => ({ error: message }));
    if (!found) {
      return { error: new ProgramNotFound().message };
    }
    return found;
  }

  async allPrograms(params: GetAllProgramsParams): Result<GetAllProgramsResult> {
    if (params.owner) {
      return await this.programService
        .getAllUserPrograms(params as GetAllUserProgramsParams)
        .catch(({ message }) => ({ error: message }));
    }
    return await this.programService.getAllPrograms(params).catch(({ message }) => ({ error: message }));
  }

  async allUserPrograms(params: GetAllUserProgramsParams): Result<GetAllProgramsResult> {
    return await this.programService.getAllUserPrograms(params).catch(({ message }) => ({ error: message }));
  }

  async addMeta(params: AddMetaParams): Result<AddMetaResult> {
    return await this.metaService.addMeta(params).catch(({ message }) => ({ error: message }));
  }

  async getMeta(params: GetMetaParams): Result<GetMetaResult> {
    return await this.metaService.getMeta(params).catch(({ message }) => ({ error: message }));
  }

  async addPayload(params: AddPayloadParams): Result<IMessage> {
    return await this.messageService.addPayload(params).catch(({ message }) => ({ error: message }));
  }

  async allMessages(params: GetMessagesParams): Result<AllMessagesResult> {
    if (params.destination && params.source) {
      return await this.messageService.getAllMessages(params).catch(({ message }) => ({ error: message }));
    }
    if (params.destination) {
      return await this.messageService.getIncoming(params).catch(({ message }) => ({ error: message }));
    }
    return await this.messageService.getOutgoing(params).catch(({ message }) => ({ error: message }));
  }

  async message(params: FindMessageParams): Result<IMessage> {
    return await this.messageService.getMessage(params).catch(({ message }) => ({ error: message }));
  }
}
