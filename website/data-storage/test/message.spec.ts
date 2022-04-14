import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Message } from '../src/entities/message.entity';
import { MessagesService } from '../src/messages/messages.service';

jest.mock('@gear-js/api', () => ({
  GearKeyring: {
    checkSign: () => true,
  },
}));

describe('Messages Service', () => {
  let messagesService!: MessagesService;

  const Message_create = jest.fn(() => ({ id: '0x7357' }));
  const Message_save = jest.fn(async () => ({ id: '0x7357' }));
  const Message_findAndCount = jest.fn(async () => [[{ id: '0x7357' }], 1] as const);
  const Message_findOne = jest.fn(async () => ({ id: '0x7357' }));

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Message),
          useValue: {
            create: Message_create,
            save: Message_save,
            findAndCount: Message_findAndCount,
            findOne: Message_findOne,
          },
        },
        MessagesService,
      ],
    }).compile();

    messagesService = moduleRef.get(MessagesService);
  });

  afterEach(() => {
    for (const { mockReset } of [Message_create, Message_save, Message_findAndCount, Message_findOne]) {
      mockReset();
    }
  });

  it('should record a sent message', async () => {
    // Given an initialized Messages Service,
    // when:
    await messagesService.save({
      id: '0x7357',
      genesis: '0x07357',
      timestamp: 0,
      blockHash: '0x0000000000000000',
      destination: '0xFFFF',
      source: '0x0000',
    });

    // then:
    expect(Message_create).toHaveBeenCalled();
    expect(Message_save).toHaveBeenCalled();
  });

  it('should fail to add payload to an inexistent message', async () => {
    // Given an initialized Messages Service,
    // when:
    expect(
      messagesService.addPayload({
        id: 'no such id',
        genesis: '0x07357',
        signature: '0x7357',
      }),
    )
      // then it should throw.
      .rejects.toBeDefined();

    expect(Message_save).not.toHaveBeenCalled();
  });

  it.only('should add payload to an existing message', async () => {
    // Given:
    Message_findOne.mockReturnValueOnce(Promise.resolve({ id: '0x7357', source: '0x0000' }));

    // when:
    await messagesService.addPayload({
      id: '0x7357',
      genesis: '0x07357',
      signature: '0x00',
    });

    // then:
    expect(Message_save).toHaveBeenCalled();
  });

  it('should select incoming messages', async () => {
    // Given:
    Message_findAndCount.mockReturnValueOnce(
      Promise.resolve([[{ id: '0x7357', destination: '0xFFFF', genesis: '0x07357' }], 1]),
    );

    // when:
    expect(messagesService.getIncoming({ destination: '0xFFFF', genesis: '0x07357' }))
      // then:
      .resolves.toEqual({ count: 1, messages: [{ destination: '0xFFFF', genesis: '0x07357', id: '0x7357' }] });

    expect(Message_findAndCount).toHaveBeenCalled();
  });

  it('should select outgoing messages', async () => {
    // Given:
    Message_findAndCount.mockReturnValueOnce(
      Promise.resolve([[{ id: '0x7357', destination: '0xFFFF', genesis: '0x07357' }], 1]),
    );

    // when:
    expect(messagesService.getOutgoing({ destination: '0xFFFF', genesis: '0x07357' }))
      // then:
      .resolves.toEqual({ count: 1, messages: [{ destination: '0xFFFF', genesis: '0x07357', id: '0x7357' }] });

    expect(Message_findAndCount).toHaveBeenCalled();
  });
});
