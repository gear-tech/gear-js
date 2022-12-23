import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Meta } from '../database/entities';

@Injectable()
export class MetaRepo {
  constructor(
    @InjectRepository(Meta)
    private metaRepo: Repository<Meta>,
  ) {}

  public async save(metadata: Meta): Promise<Meta> {
    return this.metaRepo.save(metadata);
  }
}
