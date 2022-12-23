import { Injectable } from '@nestjs/common';
import { AddStateParams, AddStateResult, GetAllStateParams, GetStateParams, GetStatesResult } from '@gear-js/common';
import { plainToClass } from 'class-transformer';
import { getStateMetadata } from '@gear-js/api';

import { StateRepo } from './state.repo';
import { ProgramRepo } from '../program/program.repo';
import { State } from '../database/entities';
import { ProgramNotFound } from '../common/errors';

@Injectable()
export class StateService {
  constructor(
    private stateRepository: StateRepo,
    private programRepository: ProgramRepo,
  ) {}

  public async listByProgramId(getAllStateParams: GetAllStateParams): Promise<GetStatesResult> {
    const { programId, genesis, query } = getAllStateParams;
    const program = await this.programRepository.get(programId, genesis);

    const [states, total] = await this.stateRepository.list(program.code.id, query);

    return {
      states,
      count: total,
    };
  }

  public async get(getStateParams: GetStateParams): Promise<State> {
    const { stateId } = getStateParams;
    return this.stateRepository.get(stateId);
  }

  public async create(addStateParams: AddStateParams): Promise<AddStateResult> {
    const { genesis, programId, wasmBuffBase64, name } = addStateParams;

    const program = await this.programRepository.get(programId, genesis);

    if (!program) {
      throw new ProgramNotFound();
    }

    const metaStateBuff = Buffer.from(wasmBuffBase64, 'base64');
    const { functions } = await getStateMetadata(metaStateBuff);
    const funcNames = Object.keys(functions);

    const createMetaDataInput = plainToClass(State, {
      code: program.code,
      name,
      wasmBuffBase64,
      funcNames,
      functions,
    });

    await this.stateRepository.save(createMetaDataInput);

    return { status: 'State added' };
  }
}
