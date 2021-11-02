import { Injectable } from '@nestjs/common';
import { Message } from 'src/messages/entities/message.entity';
import { AddPayloadParams, AllMessagesResult, GetMessagesParams } from 'src/messages/interface';
import { MessagesService } from 'src/messages/messages.service';
import { AddMetaParams, AddMetaResult, GetMetaParams, GetMetaResult } from 'src/metadata/interfaces';
import { MetadataService } from 'src/metadata/metadata.service';
import { InitStatus, Program } from 'src/programs/entities/program.entity';
import { FindProgramParams, GetAllProgramsParams, GetAllProgramsResult } from 'src/programs/interfaces';
import { ProgramsService } from 'src/programs/programs.service';

@Injectable()
export class ConsumerService {
  constructor(
    private readonly programService: ProgramsService,
    private readonly messageService: MessagesService,
    private readonly metaService: MetadataService,
  ) {}

  events = {
    Log: async (chain: string, value: any) => {
      await this.messageService.save({
        chain,
        id: value.id,
        destination: value.dest,
        source: value.source,
        isRead: true,
        date: value.date,
        payload: value.payload,
        replyTo: value.reply?.isExist ? value.reply.id : null,
        replyError: value.reply?.isExist ? value.reply.error : null,
      });
    },
    InitMessageEnqueued: async (chain: string, value: any) => {
      await this.programService.save({
        id: value.programId,
        chain,
        owner: value.origin,
        uploadedAt: value.date,
      });
      await this.messageService.save({
        chain,
        id: value.messageId,
        destination: value.programId,
        source: value.origin,
        isRead: true,
        date: value.date,
        payload: null,
        replyTo: null,
        replyError: null,
      });
    },
    DispatchMessageEnqueued: async (chain: string, value: any) => {
      await this.messageService.save({
        chain,
        id: value.messageId,
        destination: value.programId,
        source: value.origin,
        isRead: true,
        date: value.date,
        payload: null,
        replyTo: null,
        replyError: null,
      });
    },
    InitSuccess: async (chain: string, value: any) => {
      await this.programService.setStatus(value.id, chain, InitStatus.SUCCESS);
    },
    InitFailure: async (chain: string, value: any) => {
      await this.programService.setStatus(value.id, chain, InitStatus.FAILED);
    },
  };

  async programData(params: FindProgramParams): Promise<Program> {
    return await this.programService.findProgram(params);
  }

  async allPrograms(params: GetAllProgramsParams): Promise<GetAllProgramsResult> {
    if (params.owner) {
      return await this.programService.getAllUserPrograms(params);
    }
    return await this.programService.getAllPrograms(params);
  }

  async addMeta(params: AddMetaParams): Promise<AddMetaResult> {
    return await this.metaService.addMeta(params);
  }

  async getMeta(params: GetMetaParams): Promise<GetMetaResult> {
    return await this.metaService.getMeta(params);
  }

  async addPayload(params: AddPayloadParams): Promise<Message> {
    return await this.messageService.addPayload(params);
  }

  async allMessages(params: GetMessagesParams): Promise<AllMessagesResult> {
    if (params.destination && params.source) {
      return await this.messageService.getAllMessages(params);
    }
    if (params.destination) {
      return await this.messageService.getIncoming(params);
    }
    return await this.messageService.getOutgoing(params);
  }
}
