import { HexString } from '@polkadot/util/types';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { AddMetaByCodeParams, AddMetaParams, AddMetaResult } from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { CodeNotFound, InvalidCodeMetaHex, InvalidProgramMetaHex, ProgramNotFound } from '../common/errors';
import { Meta } from '../database/entities';
import { MetaRepo } from './meta.repo';
import { ProgramRepo } from '../program/program.repo';
import { CreateMetaInput } from './types/create-meta.input';
import { CodeRepo } from '../code/code.repo';
import { generateCodeHashByApi, getMetaHash, getProgramMetadataByApi } from '../common/helpers';
import { GearEventListener } from '../gear/gear-event-listener';
import { ProgramService } from '../program/program.service';
import { AddProgramMetaInput } from '../program/types';

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
    const { genesis, metaHex, codeId, name } = params;

    const code = await this.codeRepository.get(codeId, genesis);

    if(!code) throw new CodeNotFound();

    try {
      const codeMetaHash = await getMetaHash(this.gearEventListener.api.program, code.id as HexString);
      const hash = generateCodeHashByApi(metaHex as HexString);

      if(codeMetaHash && codeMetaHash !== hash) throw new InvalidCodeMetaHex();

      if(codeMetaHash) {
        const meta = await this.metaRepository.getByHash(hash);
        const metaData = getProgramMetadataByApi(metaHex as HexString);

        if(meta) {
          const updateMeta = plainToClass(Meta, { ...meta, hex: metaHex, types: metaData.types });

          code.meta = await this.metaRepository.save(updateMeta);

          const addProgramsMeta: AddProgramMetaInput = { name, meta };

          await Promise.all([
            this.codeRepository.save([code]),
            this.programService.addProgramsMetaByCode(codeId, genesis, addProgramsMeta)
          ]);
        } else {
          const createMetaInput: CreateMetaInput = { hex: metaHex, hash, types: metaData.types };
          const createMeta = await this.createMeta(createMetaInput);
          code.meta = createMeta;

          const addProgramsMeta: AddProgramMetaInput = { name, meta: createMeta };

          await Promise.all([
            this.codeRepository.save([code]),
            this.programService.addProgramsMetaByCode(codeId, genesis, addProgramsMeta)
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

    try {
      const programMetaHash = await getMetaHash(this.gearEventListener.api.program, program.id as HexString);
      const hash = generateCodeHashByApi(metaHex as HexString);

      if(programMetaHash && hash !== programMetaHash) throw new InvalidProgramMetaHex();


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

    } catch (error) {
      this.logger.error(error);
      throw new InvalidProgramMetaHex();
    }

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
