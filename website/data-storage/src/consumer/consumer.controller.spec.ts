import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerController } from './consumer.controller';

describe('ConsumerController', () => {
  let controller: ConsumerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsumerController],
    }).compile();

    controller = module.get<ConsumerController>(ConsumerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
