import { generateCodeHash, getProgramMetadata } from '@gear-js/api';
import { HexString } from '@polkadot/util/types';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AddMetaParams, AddMetaResult, GetStateByCodeParams } from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { InvalidProgramMetaHex, MetadataNotFound, ProgramNotFound } from '../common/errors';
import { ProgramService } from '../program/program.service';
import { Meta } from '../database/entities';
import { MetaRepo } from './meta.repo';
import { ProgramRepo } from '../program/program.repo';
import { UpdateProgramDataInput } from '../program/types';
import { GearEventListener } from '../gear/gear-event-listener';

@Injectable()
export class MetaService {
  constructor(
    private programService: ProgramService,
    private programRepository: ProgramRepo,
    private metaRepository: MetaRepo,
    @Inject(forwardRef(() => GearEventListener))
    private gearEventListener: GearEventListener,
  ) {}

  public async getByCodeId(params:  GetStateByCodeParams): Promise<Meta> {
    const { codeId } = params;
    const meta = await this.metaRepository.getByCodeId(codeId);

    if(!meta) throw new MetadataNotFound();

    return meta;
  }

  public async addMeta(params: AddMetaParams): Promise<AddMetaResult> {
    const { programId, genesis, metaHex, name } = params;
    const program = await this.programRepository.getByIdAndGenesis(programId, genesis);

    if (!program) {
      throw new ProgramNotFound();
    }

    if(!(await this.gearEventListener.isValidMetaHex(metaHex, programId))) {
      throw new InvalidProgramMetaHex();
    }

    const hash = generateCodeHash(metaHex as HexString);
    const meta = await this.metaRepository.get(hash);
    const metaData = getProgramMetadata(metaHex as HexString);
    const updateProgramDataInput: UpdateProgramDataInput = {
      id: params.programId,
      genesis,
      name,
    };

    if(meta) {
      updateProgramDataInput.meta = meta;
    } else {
      updateProgramDataInput.meta = plainToClass(Meta, {
        ...params,
        id: hash,
        hex: metaHex,
        types: metaData.types,
      });
    }

    await this.programService.updateProgramData(updateProgramDataInput);

    return { status: 'Metadata added' };
  }
}
