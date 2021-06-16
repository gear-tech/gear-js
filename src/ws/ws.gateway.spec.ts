import { Test, TestingModule } from '@nestjs/testing';
import { BlocksGateway } from './ws.gateway';

describe('BlocksGateway', () => {
  let gateway: BlocksGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlocksGateway],
    }).compile();

    gateway = module.get<BlocksGateway>(BlocksGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
