import { getProgramMetadata, signatureIsValid } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { Injectable } from '@nestjs/common';
import { AddMetaParams, AddMetaResult, GetMetaParams, GetMetaResult } from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { SignatureNotVerified, MetadataNotFound, ProgramNotFound } from '../common/errors';
import { ProgramService } from '../program/program.service';
import { Meta } from '../database/entities';
import { MetaRepo } from './meta.repo';
import { ProgramRepo } from '../program/program.repo';
import { UpdateProgramDataInput } from '../program/types';

@Injectable()
export class MetaService {
  constructor(
    private programService: ProgramService,
    private programRepository: ProgramRepo,
    private metadataRepository: MetaRepo,
  ) {}

  async addMeta(params: AddMetaParams): Promise<AddMetaResult> {
    const { programId, genesis, signature, metaHex, name, title } = params;
    const program = await this.programRepository.getByIdAndGenesis(programId, genesis);

    if (!program) {
      throw new ProgramNotFound();
    }

    try {
      //TODO how validate
      if (!signatureIsValid(program.owner, signature, metaHex)) {
        throw new SignatureNotVerified();
      }
    } catch (err) {
      throw new SignatureNotVerified(err.message);
    }
    const metaData = getProgramMetadata(metaHex as HexString);

    const metadataTypeDB = plainToClass(Meta, {
      ...params,
      hex: metaHex,
      data: metaData.types,
      program: program.id,
      owner: program.owner,
    });

    const metadata = await this.metadataRepository.save(metadataTypeDB);

    const updateProgramDataInput: UpdateProgramDataInput = {
      id: params.programId,
      genesis,
      name,
      title,
      meta: metadata,
    };
    await this.programService.updateProgramData(updateProgramDataInput);

    return { status: 'Metadata added' };
  }

  async getMeta(params: GetMetaParams): Promise<GetMetaResult> {
    const meta = await this.metadataRepository.getByProgramId(params.programId);
    if (!meta) {
      throw new MetadataNotFound();
    }
    return meta;
  }
}
