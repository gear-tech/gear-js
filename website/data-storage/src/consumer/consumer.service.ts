import { Injectable } from '@nestjs/common';
import { Message } from 'src/messages/entities/message.entity';
import {
  FindProgramParams,
  GetAllProgramsParams,
  GetAllProgramsResult,
  AddMetaParams,
  AddMetaResult,
  GetMetaParams,
  GetMetaResult,
  AddPayloadParams,
  AllMessagesResult,
  GetMessagesParams,
  FindMessageParams,
} from 'src/interfaces';
import { MessagesService } from 'src/messages/messages.service';
import { MetadataService } from 'src/metadata/metadata.service';
import { InitStatus, Program } from 'src/programs/entities/program.entity';
import { ProgramsService } from 'src/programs/programs.service';
import { Result } from './types';
import { ProgramNotFound } from 'src/errors';

@Injectable()
export class ConsumerService {
  constructor(
    private readonly programService: ProgramsService,
    private readonly messageService: MessagesService,
    private readonly metaService: MetadataService,
  ) {}

  events = {
    Log: (genesis: string, value: any) => {
      this.messageService.save({
        genesis,
        id: value.id,
        destination: value.dest,
        source: value.source,
        date: value.date,
        payload: value.payload,
        replyTo: value.reply?.isExist ? value.reply.id : null,
        replyError: value.reply?.isExist ? `${value.reply.error}` : null,
      });
    },
    InitMessageEnqueued: async (genesis: string, value: any) => {
      await this.programService.save({
        id: value.programId,
        genesis,
        owner: value.origin,
        uploadedAt: value.date,
      });
      this.messageService.save({
        genesis,
        id: value.messageId,
        destination: value.programId,
        source: value.origin,
        date: value.date,
        payload: null,
        replyTo: null,
        replyError: null,
      });
    },
    DispatchMessageEnqueued: (genesis: string, value: any) => {
      this.messageService.save({
        genesis,
        id: value.messageId,
        destination: value.programId,
        source: value.origin,
        date: value.date,
        payload: null,
        replyTo: null,
        replyError: null,
      });
    },
    InitSuccess: (genesis: string, value: any) => {
      this.programService.setStatus(value.programId, genesis, InitStatus.SUCCESS);
    },
    InitFailure: (genesis: string, value: any) => {
      this.programService.setStatus(value.programId, genesis, InitStatus.FAILED);
    },
    MessageDispatched: (genesis: string, value: any) => {},
  };

  async programData(params: FindProgramParams): Result<Program> {
    try {
      return (await this.programService.findProgram(params)) || { error: new ProgramNotFound().message };
    } catch (error) {
      return { error: error.message };
    }
  }

  async allPrograms(params: GetAllProgramsParams): Result<GetAllProgramsResult> {
    try {
      if (params.owner) {
        return await this.programService.getAllUserPrograms(params);
      }
      return await this.programService.getAllPrograms(params);
    } catch (error) {
      return { error: error.message };
    }
  }

  async addMeta(params: AddMetaParams): Result<AddMetaResult> {
    try {
      return await this.metaService.addMeta(params);
    } catch (error) {
      return { error: error.message };
    }
  }

  async getMeta(params: GetMetaParams): Result<GetMetaResult> {
    try {
      console.log(params);
      return await this.metaService.getMeta(params);
    } catch (error) {
      return { error: error.message };
    }
  }

  async addPayload(params: AddPayloadParams): Result<Message> {
    try {
      return await this.messageService.addPayload(params);
    } catch (error) {
      return { error: error.message };
    }
  }

  async allMessages(params: GetMessagesParams): Result<AllMessagesResult> {
    try {
      if (params.destination && params.source) {
        return await this.messageService.getAllMessages(params);
      }
      if (params.destination) {
        return await this.messageService.getIncoming(params);
      }
      return await this.messageService.getOutgoing(params);
    } catch (error) {
      return { error: error.message };
    }
  }

  async message(params: FindMessageParams): Result<Message> {
    try {
      return await this.messageService.getMessage(params);
    } catch (error) {
      return { error: error.message };
    }
  }
}
