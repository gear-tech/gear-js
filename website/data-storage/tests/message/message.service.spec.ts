import { Test } from '@nestjs/testing';

import { MessageService } from '../../src/message/message.service';
import { mockMessageRepository } from '../../src/common/mock/message/message-repository.mock';
import { MessageRepo } from '../../src/message/message.repo';

const MESSAGE_ENTITY_ID = '0x7357';

describe('Message service', () => {
  let messageService!: MessageService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: MessageRepo,
          useFactory: () => mockMessageRepository,
        },
        MessageService,
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

  // it('should fail to add payload to an inexistent message', async () => {
  //   // Given an initialized Messages Service,
  //   // when:
  //   expect(
  //     messagesService.addPayload({
  //       id: 'no such id',
  //       genesis: '0x07357',
  //       signature: '0x7357',
  //     }),
  //   )
  //     // then it should throw.
  //     .rejects.toBeDefined();
  //
  //   expect(Message_save).not.toHaveBeenCalled();
  // });
  //
  // it.only('should add payload to an existing message', async () => {
  //   // Given:
  //   Message_findOne.mockReturnValueOnce(Promise.resolve({ id: '0x7357', source: '0x0000' }));
  //
  //   // when:
  //   await messagesService.addPayload({
  //     id: '0x7357',
  //     genesis: '0x07357',
  //     signature: '0x00',
  //   });
  //
  //   // then:
  //   expect(Message_save).toHaveBeenCalled();
  // });
  //
  // it('should select incoming messages', async () => {
  //   // Given:
  //   Message_findAndCount.mockReturnValueOnce(
  //     Promise.resolve([[{ id: '0x7357', destination: '0xFFFF', genesis: '0x07357' }], 1]),
  //   );
  //
  //   // when:
  //   expect(messagesService.getIncoming({ destination: '0xFFFF', genesis: '0x07357' }))
  //     // then:
  //     .resolves.toEqual({ count: 1, messages: [{ destination: '0xFFFF', genesis: '0x07357', id: '0x7357' }] });
  //
  //   expect(Message_findAndCount).toHaveBeenCalled();
  // });
  //
  // it('should select outgoing messages', async () => {
  //   // Given:
  //   Message_findAndCount.mockReturnValueOnce(
  //     Promise.resolve([[{ id: '0x7357', destination: '0xFFFF', genesis: '0x07357' }], 1]),
  //   );
  //
  //   // when:
  //   expect(messagesService.getOutgoing({ destination: '0xFFFF', genesis: '0x07357' }))
  //     // then:
  //     .resolves.toEqual({ count: 1, messages: [{ destination: '0xFFFF', genesis: '0x07357', id: '0x7357' }] });
  //
  //   expect(Message_findAndCount).toHaveBeenCalled();
  // });
});
