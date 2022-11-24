import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Meta } from '../database/entities';

@Injectable()
export class MetadataRepo {
  constructor(
    @InjectRepository(Meta)
    private metadataRepo: Repository<Meta>,
  ) {}

  public async save(metadata: Meta): Promise<Meta> {
    return this.metadataRepo.save(metadata);
  }

  public async getByProgramId(programId: string): Promise<Meta> {
    return this.metadataRepo.findOne({
      where: { program: programId },
      select: ['program', 'meta', 'metaWasm'],
    });
  }
}
