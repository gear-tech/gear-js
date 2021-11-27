import { GearKeyring } from '@gear-js/api';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetadataNotFound, ProgramNotFound, SignNotVerified } from 'src/json-rpc/errors';
import { ProgramsService } from 'src/programs/programs.service';
import { Repository } from 'typeorm';
import { Meta } from './entities/meta.entity';

@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(Meta)
    private readonly metaRepo: Repository<Meta>,
    private readonly programService: ProgramsService,
  ) {}

  async addMeta(data: {
    signature: string;
    meta: string;
    programId: string;
    name?: string;
    title?: string;
    metaFile?: string;
  }) {
    const program = await this.programService.findProgram(data.programId);
    if (!program) {
      throw new ProgramNotFound();
    }
    if (!GearKeyring.checkSign(program.owner, data.signature, data.meta)) {
      throw new SignNotVerified();
    } else {
      let metadata = await this.metaRepo.findOne({ program: data.programId });
      if (!metadata) {
        metadata = this.metaRepo.create({
          owner: program.owner,
          meta: data.meta,
          program: program.hash,
          metaFile: data.metaFile,
        });
      } else {
        metadata.meta = data.meta;
        metadata.metaFile = data.metaFile;
      }
      const savedMeta = await this.metaRepo.save(metadata);
      try {
        await this.programService.addProgramInfo(data.programId, data.name, data.title, savedMeta);
      } catch (error) {
        throw error;
      }
      return { status: 'Metadata added' };
    }
  }

  async getMeta(programId: string) {
    const program = await this.programService.findProgram(programId);
    if (!program) {
      throw new MetadataNotFound();
    }
    const meta = await this.metaRepo.findOne({ program: programId });
    if (meta) {
      return { program: meta.program, meta: meta.meta, metaFile: meta.metaFile };
    } else {
      throw new MetadataNotFound();
    }
  }
}
