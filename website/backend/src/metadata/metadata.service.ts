import { GearKeyring } from '@gear-js/api';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async addMeta(data: { signature: string; meta: string; programId: string; name?: string; title?: string }) {
    const program = await this.programService.findProgram(data.programId);
    if (!program) {
      return { status: 'Program not found' };
    }
    if (!GearKeyring.checkSign(program.owner, data.signature, data.meta)) {
      return { status: 'Signature not verified' };
    } else {
      const metadata = this.metaRepo.create({
        owner: program.owner,
        meta: data.meta,
        program: program.hash,
      });
      const savedMeta = await this.metaRepo.save(metadata);
      try {
        const program = await this.programService.addProgramInfo(data.programId, data.name, data.title, savedMeta);
      } catch (error) {
        throw error;
      }
      return { status: 'Metadata added' };
    }
  }

  async getMeta(programId: string) {
    const program = await this.programService.findProgram(programId);
    if (!program) {
      return { status: 'Metadata for program not found' };
    }
    return await this.metaRepo.findOne({ program: programId });
  }
}
