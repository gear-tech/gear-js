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

  async addMeta(data: {
    signature: string;
    meta: string;
    owner: string;
    programId: string;
    name?: string;
    title?: string;
  }) {
    if (!GearKeyring.checkSign(data.owner, data.signature, data.meta)) {
      return { status: 'Signature not verified' };
    } else {
      const metadata = this.metaRepo.create({
        owner: data.owner,
        meta: data.meta,
        programId: data.programId,
      });
      const savedMeta = await this.metaRepo.save(metadata);
      this.programService.addProgramInfo(data.programId, data.name, data.title, savedMeta);
      return { status: 'Metadata added' };
    }
  }

  async getMeta(programId: string) {
    return await this.metaRepo.findOne({ programId });
  }
}
