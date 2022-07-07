import { Test } from '@nestjs/testing';

import { MessageService } from '../../src/message/message.service';
import { mockMessageRepository } from '../../src/common/mock/message/message-repository.mock';
import { MessageRepo } from '../../src/message/message.repo';
import { FindMessageParams, GetMessagesParams } from '@gear-js/common';
import { MESSAGE_DB_MOCK } from '../../src/common/mock/message/message-db.mock';
import { ProgramModule } from '../../src/program/program.module';
import { ProgramService } from '../../src/program/program.service';
import { ProgramRepo } from '../../src/program/program.repo';
import { mockProgramRepository } from '../../src/common/mock/program/program-repository.mock';

const MESSAGE_ENTITY_ID = '0x7357';

describe('Message service', () => {
  let messageService!: MessageService;
  let programService!: ProgramService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: MessageRepo,
          useFactory: () => mockMessageRepository,
        },
        MessageService,
        {
          provide: ProgramRepo,
          useFactory: () => mockProgramRepository,
        },
        ProgramService,
      ],
    }).compile();

    messageService = moduleRef.get<MessageService>(MessageService);
  });

  it('should be successfully create message', async () => {
    const createMessageInput = {
      id: MESSAGE_ENTITY_ID,
      genesis: '0x07357',
      timestamp: 0,
      blockHash: '0x0000000000000000',
      destination: '0xFFFF',
      source: '0x0000',
    };

    const message = await messageService.createMessage(createMessageInput);

    expect(message.id).toEqual(createMessageInput.id);
    expect(mockMessageRepository.save).toHaveBeenCalled();
  });

  it('should be successfully get messages and called listByIdAndSourceAndDestination method', async () => {
    const messageMock = MESSAGE_DB_MOCK[0];

    const params: GetMessagesParams = {
      genesis: messageMock.genesis,
      destination: messageMock.destination,
      source: messageMock.source,
      limit: 1,
    };

    const result = await messageService.getAllMessages(params);

    expect(result.messages[0].id).toEqual(messageMock.id);
    expect(result.messages[0].source).toEqual(messageMock.source);
    expect(result.messages[0].destination).toEqual(messageMock.destination);
    expect(mockMessageRepository.listByIdAndSourceAndDestination).toHaveBeenCalled();
  });

  it('should be successfully get message and called getByIdAndGenesis method', async () => {
    const messageMock = MESSAGE_DB_MOCK[0];

    const params: FindMessageParams = {
      id: messageMock.id,
      genesis: messageMock.genesis,
    };

    const message = await messageService.getMessage(params);

    expect(message.id).toEqual(messageMock.id);
    expect(message.source).toEqual(messageMock.source);
    expect(message.destination).toEqual(messageMock.destination);
    expect(mockMessageRepository.getByIdAndGenesis).toHaveBeenCalled();
  });

  it('should fail if message not found and called getByIdAndGenesis method', async () => {
    const params: FindMessageParams = {
      id: 'not_exist_id',
      genesis: 'not_exist_genesis',
    };

    await expect(messageService.getMessage(params)).rejects.toThrowError();
    expect(mockMessageRepository.getByIdAndGenesis).toHaveBeenCalled();
  });

  it('should be successfully deleted message and called remove method', async () => {
    const messageMock = MESSAGE_DB_MOCK[0];

    await messageService.deleteRecords(messageMock.genesis);
    expect(mockMessageRepository.remove).toHaveBeenCalled();
  });
});
