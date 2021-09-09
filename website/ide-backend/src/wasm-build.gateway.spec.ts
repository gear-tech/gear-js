import { Test, TestingModule } from '@nestjs/testing';
import { WasmBuildGateway } from './wasm-build.gateway';

describe('WasmBuildGateway', () => {
  let gateway: WasmBuildGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WasmBuildGateway],
    }).compile();

    gateway = module.get<WasmBuildGateway>(WasmBuildGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
