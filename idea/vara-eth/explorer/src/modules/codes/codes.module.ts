import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Code } from '@vara-eth/idea-indexer-db';

import { CodesController } from './codes.controller.js';
import { CodesService } from './codes.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Code])],
  controllers: [CodesController],
  providers: [CodesService],
  exports: [CodesService],
})
export class CodesModule {}
