import { Injectable } from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';
import { MetadataService } from 'src/metadata/metadata.service';
import { InitStatus } from 'src/programs/entities/program.entity';
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
}
