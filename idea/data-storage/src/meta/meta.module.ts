import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MetaService } from './meta.service';
import { MetaRepo } from './meta.repo';
import { Meta } from '../database/entities';
import { ProgramModule } from '../program/program.module';
import { GearModule } from '../gear/gear.module';

@Module({
  imports: [
    ProgramModule,
    forwardRef(() => GearModule),
    TypeOrmModule.forFeature([Meta])],
  providers: [MetaService, MetaRepo],
  exports: [MetaService, MetaRepo],
})
export class MetaModule {}
