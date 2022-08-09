import { Injectable } from '@nestjs/common';
import {
  AddMetaParams,
  AddMetaResult,
  AllMessagesResult,
  CODE_STATUS,
  FindMessageParams,
  FindProgramParams,
  GetAllCodeParams,
  GetAllCodeResult,
  GetAllProgramsParams,
  GetAllProgramsResult,
  GetAllUserProgramsParams,
  GetCodeParams,
  GetMessagesParams,
  GetMetaParams,
  GetMetaResult,
  ICode,
  ICodeChangedKafkaValue,
  IGenesis,
  IMessage,
  IMessageEnqueuedKafkaValue,
  IMessagesDispatchedKafkaValue,
  InitStatus,
  IProgramChangedKafkaValue,
  IUserMessageReadKafkaValue,
  IUserMessageSentKafkaValue,
  MESSAGE_TYPE,
  ProgramDataResult,
  UpdateMessageData,
} from '@gear-js/common';

import { Result } from './types';
import { ProgramService } from '../program/program.service';
import { MessageService } from '../message/message.service';
import { MetadataService } from '../metadata/metadata.service';
import { FormResponse } from '../middleware/formResponse';
import { CodeService } from '../code/code.service';
import { UpdateCodeInput } from '../code/types';
import { sleep } from '../utils/sleep';

@Injectable()
export class ConsumerService {
  constructor(
    private programService: ProgramService,
    private messageService: MessageService,
    private metaService: MetadataService,
    private codeService: CodeService,
  ) {}

  events = {
    UserMessageSent: async (value: IUserMessageSentKafkaValue) => {
      await sleep(1000);
      this.messageService.createMessage({ ...value, type: MESSAGE_TYPE.USER_MESS_SENT });
    },
    MessageEnqueued: ({
      id,
      destination,
      source,
      entry,
      genesis,
      timestamp,
      blockHash,
    }: IMessageEnqueuedKafkaValue) => {
      if (entry === 'Init') {
        this.programService.createProgram({
          id: destination,
          owner: source,
          genesis: genesis,
          timestamp: timestamp,
          blockHash: blockHash,
        });
      }
      this.messageService.createMessage({
        id: id,
        destination: destination,
        source: source,
        entry,
        payload: null,
        replyToMessageId: null,
        exitCode: null,
        genesis: genesis,
        blockHash: blockHash,
        timestamp: timestamp,
        type: MESSAGE_TYPE.ENQUEUED,
      });
    },
    ProgramChanged: (value: IProgramChangedKafkaValue) => {
      if (value.isActive) {
        this.programService.setStatus(value.id, value.genesis, InitStatus.SUCCESS);
      }
    },
    CodeChanged: (value: ICodeChangedKafkaValue) => {
      const updateCodeInput: UpdateCodeInput = {
        ...value,
        status: value.change as CODE_STATUS,
      };
      this.codeService.updateCode(updateCodeInput);
    },
    MessagesDispatched: (value: IMessagesDispatchedKafkaValue) => {
      this.messageService.setDispatchedStatus(value);
    },
    UserMessageRead: async (value: IUserMessageReadKafkaValue) => {
      this.messageService.updateReadStatus(value.id, value.reason);
    },
    DatabaseWiped: async (value: IGenesis) => {
      await Promise.all([
        this.messageService.deleteRecords(value.genesis),
        this.programService.deleteRecords(value.genesis),
        this.codeService.deleteRecords(value.genesis),
      ]);
    },
  };

  async updateMessages(params: UpdateMessageData[]): Result<void> {
    await this.messageService.updateMessagesData(params);
  }

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
  async allMessages(params: GetMessagesParams): Result<AllMessagesResult> {
    return await this.messageService.getAllMessages(params);
  }

  @FormResponse
  async message(params: FindMessageParams): Result<IMessage> {
    return await this.messageService.getMessage(params);
  }

  @FormResponse
  async allCode(params: GetAllCodeParams): Result<GetAllCodeResult> {
    return await this.codeService.getAllCode(params);
  }

  @FormResponse
  async code(params: GetCodeParams): Result<ICode> {
    return await this.codeService.getByIdAndGenesis(params);
  }
}
