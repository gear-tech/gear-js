import { Injectable } from '@nestjs/common';
import { AddStateParams, AddStateResult, GetAllStateParams, GetStateParams, GetStatesResult } from '@gear-js/common';
import { plainToClass } from 'class-transformer';

import { StateRepo } from './state.repo';
import { ProgramRepo } from '../program/program.repo';
import { State } from '../database/entities';
import { ProgramNotFound } from '../common/errors';
import { StateAlreadyExists, StateNotFound } from '../common/errors/state';
import { getCodeHash, getStateMeta } from '../common/helpers';
import { StateToCodeService } from '../state-to-code/state-to-code.service';


@Injectable()
export class StateService {
  constructor(
    private stateRepository: StateRepo,
    private programRepository: ProgramRepo,
    private stateToCodeService: StateToCodeService,
  ) {}

  public async listByProgramId(getAllStateParams: GetAllStateParams): Promise<GetStatesResult> {
    const { programId, genesis, query } = getAllStateParams;

    const program = await this.programRepository.get(programId, genesis);

    if (!program) {
      throw new ProgramNotFound();
    }

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
    const hexState = getCodeHash(metaStateBuff);
    const isExistStateByCode = await this.stateToCodeService.isExistStateHexByCode(hexState, program.code.id);

    if(isExistStateByCode){
      throw new StateAlreadyExists();
    }

    const { functions } = await getStateMeta(metaStateBuff);
    const funcNames = Object.keys(functions);

    const createMetaDataInput = plainToClass(State, {
      name,
      wasmBuffBase64,
      funcNames,
      functions,
    });

    const state = await this.stateRepository.save(createMetaDataInput);

    await this.stateToCodeService.create(program.code, state, hexState);

    return { status: 'State added', state: {
      id: state.id,
      name: state.name,
      wasmBuffBase64: state.wasmBuffBase64,
      functions: state.functions },
    };
  }
}
