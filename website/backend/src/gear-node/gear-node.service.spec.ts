import { Test, TestingModule } from '@nestjs/testing';
import { GearNodeService } from './gear-node.service';

describe('GearNodeService', () => {
  let service: GearNodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GearNodeService],
    }).compile();

    service = module.get<GearNodeService>(GearNodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
