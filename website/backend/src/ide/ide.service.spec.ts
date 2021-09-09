import { Test, TestingModule } from '@nestjs/testing';
import { IdeService } from './ide.service';

describe('IdeService', () => {
  let service: IdeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdeService],
    }).compile();

    service = module.get<IdeService>(IdeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
