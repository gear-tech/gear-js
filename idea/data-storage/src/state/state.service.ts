import { Injectable } from '@nestjs/common';
import { AddStateParams, AddStateResult, GetAllStateParams, GetStateParams, GetStatesResult } from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { StateRepo } from './state.repo';
import { ProgramRepo } from '../program/program.repo';
import { State } from '../database/entities';
import { ProgramNotFound } from '../common/errors';
import { StateNotFound } from '../common/errors/state';
import { getStateMeta } from '../common/helpers';

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
    const { id } = getStateParams;

    const state = await this.stateRepository.get(id);

    if(!state) {
      throw new StateNotFound();
    }

    return this.stateRepository.get(id);
  }

  public async create(addStateParams: AddStateParams): Promise<AddStateResult> {
    const { genesis, programId, wasmBuffBase64, name } = addStateParams;

    const program = await this.programRepository.get(programId, genesis);

    if (!program) {
      throw new ProgramNotFound();
    }

    const metaStateBuff = Buffer.from(wasmBuffBase64, 'base64');
    const { functions } = await getStateMeta(metaStateBuff);
    const funcNames = Object.keys(functions);

    const createMetaDataInput = plainToClass(State, {
      code: program.code,
      name,
      wasmBuffBase64,
      funcNames,
      functions,
    });

    const state = await this.stateRepository.save(createMetaDataInput);

    return { status: 'State added', state: {
      id: state.id,
      name: state.name,
      wasmBuffBase64: state.wasmBuffBase64,
      functions: state.functions },
    };
  }
}
