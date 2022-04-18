import { Repository } from 'typeorm';
import { GearKeyring } from '@gear-js/api';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddMetaParams, AddMetaResult, GetMetaParams, GetMetaResult } from '@gear-js/interfaces';
import { SignatureNotVerified, MetadataNotFound } from '../errors';
import { ProgramsService } from '../programs/programs.service';
import { Meta } from '../entities/meta.entity';
import { sleep } from '../utils';

@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(Meta)
    private readonly metaRepo: Repository<Meta>,
    private readonly programService: ProgramsService,
  ) {}

  async addMeta(params: AddMetaParams): Promise<AddMetaResult> {
    await sleep(1000);
    const program = await this.programService.findProgram({
      id: params.programId,
      genesis: params.genesis,
    });
    if (!GearKeyring.checkSign(program.owner, params.signature, params.meta)) {
      throw new SignatureNotVerified();
    }
    const metadata = this.metaRepo.create({
      owner: program.owner,
      meta: typeof params.meta === 'string' ? params.meta : JSON.stringify(params.meta),
      metaFile: params.metaFile,
      program: program.id,
    });
    const savedMeta = await this.metaRepo.save(metadata);
    await this.programService.addProgramInfo(params.programId, params.genesis, params.name, params.title, savedMeta);

    return { status: 'Metadata added' };
  }

  async getMeta(params: GetMetaParams): Promise<GetMetaResult> {
    const meta = await this.metaRepo.findOne({ where: { program: params.programId } });
    if (!meta) {
      throw new MetadataNotFound();
    }
    return { program: meta.program, meta: meta.meta, metaFile: meta.metaFile };
  }
}
