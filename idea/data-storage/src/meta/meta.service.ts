import { HexString } from '@polkadot/util/types';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import {
  AddMetaByCodeParams,
  AddMetaParams,
  AddMetaResult,
} from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import {
  CodeNotFound,
  InvalidCodeMetaHex,
  InvalidProgramMetaHex,
  MetadataNotFound,
  ProgramNotFound,
} from '../common/errors';
import { Meta } from '../database/entities';
import { MetaRepo } from './meta.repo';
import { ProgramRepo } from '../program/program.repo';
import { CreateMetaInput } from './types/create-meta.input';
import { CodeRepo } from '../code/code.repo';
import { generateCodeHashByApi, getProgramMetadataByApi } from '../common/helpers';
import { GearEventListener } from '../gear/gear-event-listener';
import { ProgramService } from '../program/program.service';

@Injectable()
export class MetaService {
  private logger: Logger = new Logger(MetaService.name);
  constructor(
    private programRepository: ProgramRepo,
    private programService: ProgramService,
    private metaRepository: MetaRepo,
    private codeRepository: CodeRepo,
    @Inject(forwardRef(() => GearEventListener))
    private gearEventListener: GearEventListener,
  ) {}

  public async getByHash(hash: string): Promise<Meta> {
    return this.metaRepository.getByHash(hash);
  }

  public async addMetaByCode(params: AddMetaByCodeParams): Promise<AddMetaResult> {
    const { genesis, metaHex, codeId } = params;

    const code = await this.codeRepository.get(codeId, genesis);

    if(!code) throw new CodeNotFound();

    try {
      const metaHash = await this.gearEventListener.api.code.metaHash(code.id as HexString);
      const hash = generateCodeHashByApi(metaHex as HexString);

      if(metaHash && metaHash !== hash) throw new InvalidCodeMetaHex();

      if(metaHash) {
        const meta = await this.metaRepository.getByHash(hash);
        const metaData = getProgramMetadataByApi(metaHex as HexString);

        if(meta) {
          const updateMeta = plainToClass(Meta, { ...meta, hex: metaHex, types: metaData.types });

          const updatedMeta = await this.metaRepository.save(updateMeta);
          code.meta = updatedMeta;

          await Promise.all([
            this.codeRepository.save([code]),
            this.programService.addProgramsMetaByCode(codeId, genesis, updatedMeta)
          ]);
        } else {
          const createMetaInput: CreateMetaInput = { hex: metaHex, hash, types: metaData.types };
          const createMeta = await this.createMeta(createMetaInput);
          code.meta = createMeta;

          await Promise.all([
            this.codeRepository.save([code]),
            this.programService.addProgramsMetaByCode(codeId, genesis, createMeta)
          ]);
        }
      }
    } catch (error) {
      this.logger.error(error);
      throw new InvalidCodeMetaHex();
    }

    return { status: 'Metadata added' };
  }

  public async addMetaByProgram(params: AddMetaParams): Promise<AddMetaResult> {
    const { programId, genesis, metaHex, name } = params;
    const program = await this.programRepository.getByIdAndGenesis(programId, genesis);

    if (!program) throw new ProgramNotFound();

    if(program.meta === null) throw new MetadataNotFound();

    const hash = generateCodeHashByApi(metaHex as HexString);

    this.validateProgramMetaHex(program.meta, hash);
    const metaData = getProgramMetadataByApi(metaHex as HexString);
    const meta = await this.metaRepository.getByHash(hash);

    const updateMeta = plainToClass(Meta, {
      ...meta,
      hex: metaHex,
      types: metaData.types,
    });

    program.name = name;

    await Promise.all([
      this.metaRepository.save(updateMeta),
      this.programRepository.save([program])
    ]);

    return { status: 'Metadata added' };
  }

  public async createMeta(createMetaInput: CreateMetaInput): Promise<Meta> {
    const createMeta = plainToClass(Meta, {
      ...createMetaInput
    });

    return this.metaRepository.save(createMeta);
  }

  private validateProgramMetaHex(meta: Meta, hash: string): void {
    if(meta.hash !== hash) throw new InvalidProgramMetaHex();
  }
}
