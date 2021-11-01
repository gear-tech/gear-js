import { Repository } from 'typeorm';
import { GearKeyring } from '@gear-js/api';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProgramNotFound, SignNotVerified, MetadataNotFound } from '../errors';
import { ProgramsService } from '../programs/programs.service';
import { Meta } from './entities/meta.entity';

@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(Meta)
    private readonly metaRepo: Repository<Meta>,
    private readonly programService: ProgramsService,
  ) {}

  async addMeta({ chain, programId, signature, meta, name, title }) {
    const program = await this.programService.findProgram(programId, chain);
    if (!program) {
      throw new ProgramNotFound();
    }
    if (!GearKeyring.checkSign(program.owner, signature, meta)) {
      throw new SignNotVerified();
    } else {
      const metadata = this.metaRepo.create({
        owner: program.owner,
        meta: meta,
        program: program.id,
      });
      const savedMeta = await this.metaRepo.save(metadata);
      try {
        await this.programService.addProgramInfo(
          programId,
          chain,
          name,
          title,
          savedMeta,
        );
      } catch (error) {
        throw error;
      }
      return { status: 'Metadata added' };
    }
  }

  async getMeta(programId: string, chain: string) {
    const program = await this.programService.findProgram(programId, chain);
    if (!program) {
      throw new ProgramNotFound();
    }
    const meta = await this.metaRepo.findOne({ program: programId });
    if (meta) {
      return { program: meta.program, meta: meta.meta };
    } else {
      throw new MetadataNotFound();
    }
  }
}
