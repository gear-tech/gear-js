import { Test, TestingModule } from '@nestjs/testing';
import { WsRpcGateway } from './ws-rpc.gateway';

describe('WsRpcGateway', () => {
  let gateway: WsRpcGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WsRpcGateway],
    }).compile();

    gateway = module.get<WsRpcGateway>(WsRpcGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
