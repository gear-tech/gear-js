import { Test, TestingModule } from '@nestjs/testing';
import { RpcController } from './rpc.controller';

describe('RpcController', () => {
  let controller: RpcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RpcController],
    }).compile();

    controller = module.get<RpcController>(RpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
