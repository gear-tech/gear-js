import { Test, TestingModule } from '@nestjs/testing';
import { GearNodeController } from './gear-node.controller';

describe('GearNodeController', () => {
  let controller: GearNodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GearNodeController],
    }).compile();

    controller = module.get<GearNodeController>(GearNodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
