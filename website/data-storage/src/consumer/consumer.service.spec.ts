import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { Meta } from 'src/entities/meta.entity';
import { Program } from 'src/entities/program.entity';
import { MessagesService } from 'src/messages/messages.service';
import { MetadataService } from 'src/metadata/metadata.service';
import { ProgramsService } from 'src/programs/programs.service';
import { ConsumerService } from './consumer.service';

describe('Consumer service', () => {
  let programService: ProgramsService;
  let messageService: MessagesService;
  let metadataService: MetadataService;
  let consumerService: ConsumerService;

  const find_one = jest.fn(async () => {
    throw new Error();
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Program),
          useValue: {
            findOne: find_one,
          },
        },
        {
          provide: getRepositoryToken(Message),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Meta),
          useValue: {},
        },
        ProgramsService,
        MessagesService,
        MetadataService,
      ],
    }).compile();
    programService = moduleRef.get(ProgramsService);
    messageService = moduleRef.get(MessagesService);
    metadataService = moduleRef.get(MetadataService);

    consumerService = new ConsumerService(programService, messageService, metadataService);
  });
  describe('Program', () => {
    it('programData should returns error message', async () => {
      expect(await consumerService.programData({ id: '0x00', genesis: '0x00' })).toEqual({
        error: 'Program not found',
      });
    });
  });
});
