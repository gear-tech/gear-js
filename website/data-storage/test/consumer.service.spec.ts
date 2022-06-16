import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProgramService } from '../src/program/program.service';
import { MessageService } from '../src/message/message.service';
import { MetadataService } from '../src/metadata/metadata.service';
import { ConsumerService } from '../src/consumer/consumer.service';
import { Message, Meta, Program } from '../src/entities';

describe('Consumer service', () => {
  let programService: ProgramService;
  let messageService: MessageService;
  let metadataService: MetadataService;
  let consumerService: ConsumerService;

  const find_one = jest.fn(async () => {
    return null;
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
          useValue: { findOne: find_one },
        },
        {
          provide: getRepositoryToken(Meta),
          useValue: {
            findOne: find_one,
          },
        },
        ProgramService,
        MessageService,
        MetadataService,
      ],
    }).compile();
    programService = moduleRef.get(ProgramService);
    messageService = moduleRef.get(MessageService);
    metadataService = moduleRef.get(MetadataService);

    consumerService = new ConsumerService(programService, messageService, metadataService);
  });
  describe('Program', () => {
    it('programData should returns error message', async () => {
      expect(await consumerService.programData({ id: '0x00', genesis: '0x00' })).toEqual({
        error: 'ProgramNotFound',
      });
    });

    it('getMeta should returns error message', async () => {
      expect(await consumerService.getMeta({ programId: '0x00', genesis: '0x00' })).toEqual({
        error: 'MetadataNotFound',
      });
    });

    it('getMeta should returns error message', async () => {
      expect(await consumerService.message({ id: '0x00', genesis: '0x00' })).toEqual({
        error: 'MessageNotFound',
      });
    });
  });
});
