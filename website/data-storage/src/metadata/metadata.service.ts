import { Repository } from 'typeorm';
import { GearKeyring } from '@gear-js/api';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramNotFound, SignNotVerified, MetadataNotFound } from '../errors';
import { ProgramsService } from '../programs/programs.service';
import { Meta } from './entities/meta.entity';
import { AddMetaParams, AddMetaResult, GetMetaParams, GetMetaResult } from 'src/interfaces';

@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(Meta)
    private readonly metaRepo: Repository<Meta>,
    private readonly programService: ProgramsService,
  ) {}

  async addMeta(params: AddMetaParams): Promise<AddMetaResult> {
    const program = await this.programService.findProgram({
      id: params.programId,
      genesis: params.genesis,
    });
    if (!program) {
      throw new ProgramNotFound();
    }
    if (!GearKeyring.checkSign(program.owner, params.signature, params.meta)) {
      throw new SignNotVerified();
    } else {
      const metadata = this.metaRepo.create({
        owner: program.owner,
        meta: typeof params.meta === 'string' ? params.meta : JSON.stringify(params.meta),
        metaFile: params.metaFile,
        program: program.id,
      });
      const savedMeta = await this.metaRepo.save(metadata);
      try {
        await this.programService.addProgramInfo(
          params.programId,
          params.genesis,
          params.name,
          params.title,
          savedMeta,
        );
      } catch (error) {
        throw error;
      }
      return { status: 'Metadata added' };
    }
  }

  async getMeta(params: GetMetaParams): Promise<GetMetaResult> {
    const program = await this.programService.findProgram({
      id: params.programId,
      genesis: params.genesis,
    });
    if (!program) {
      throw new ProgramNotFound();
    }
    const meta = await this.metaRepo.findOne({ program: params.programId });
    if (meta) {
      return { program: meta.program, meta: meta.meta, metaFile: meta.metaFile };
    } else {
      throw new MetadataNotFound();
    }
  }
}
