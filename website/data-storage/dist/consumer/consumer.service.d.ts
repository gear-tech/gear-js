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
} from '@gear-js/backend-interfaces';
import { MessagesService } from 'src/messages/messages.service';
import { MetadataService } from 'src/metadata/metadata.service';
import { Program } from 'src/programs/entities/program.entity';
import { ProgramsService } from 'src/programs/programs.service';
import { Result } from './types';
export declare class ConsumerService {
  private readonly programService;
  private readonly messageService;
  private readonly metaService;
  constructor(programService: ProgramsService, messageService: MessagesService, metaService: MetadataService);
  events: {
    Log: (genesis: string, chain: string, value: any) => void;
    InitMessageEnqueued: (genesis: string, chain: string, value: any) => Promise<void>;
    DispatchMessageEnqueued: (genesis: string, chain: string, value: any) => void;
    InitSuccess: (genesis: string, chain: string, value: any) => void;
    InitFailure: (genesis: string, chain: string, value: any) => void;
  };
  programData(params: FindProgramParams): Result<Program>;
  allPrograms(params: GetAllProgramsParams): Result<GetAllProgramsResult>;
  addMeta(params: AddMetaParams): Result<AddMetaResult>;
  getMeta(params: GetMetaParams): Result<GetMetaResult>;
  addPayload(params: AddPayloadParams): Result<Message>;
  allMessages(params: GetMessagesParams): Result<AllMessagesResult>;
}
