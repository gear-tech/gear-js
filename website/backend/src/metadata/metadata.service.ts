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

  async addMeta(
    signature: string,
    meta: string,
    owner: string,
    programId: string,
  ) {
    if (!GearKeyring.checkSign(owner, signature, meta)) {
      return { status: 'Signature not verified' };
    } else {
      const metadata = this.metaRepo.create({
        owner,
        meta,
        programId,
      });
      await this.metaRepo.save(metadata);
      return { status: 'Metadata added' };
    }
  }

  async getMeta(programId: string) {
    return await this.metaRepo.findOne({ programId });
  }
}
