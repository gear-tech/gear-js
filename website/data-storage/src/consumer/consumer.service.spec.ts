import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerService } from './consumer.service';

describe('ConsumerService', () => {
  let service: ConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumerService],
    }).compile();

    service = module.get<ConsumerService>(ConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
