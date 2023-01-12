import { Injectable } from '@nestjs/common';
import { AddStateParams, AddStateResult, GetAllStateParams, GetStateParams, GetStatesResult } from '@gear-js/common';
import { plainToClass } from 'class-transformer';
import { Hex } from '@gear-js/api';
import * as dotenv from 'dotenv';
dotenv.config();

import { StateRepo } from './state.repo';
import { ProgramRepo } from '../program/program.repo';
import { State } from '../database/entities';
import { ProgramNotFound } from '../common/errors';
import { StateAlreadyExists, StateNotFound } from '../common/errors/state';
import { getHexWasmState, getStateMeta } from '../common/helpers';

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
    const hexState = getHexWasmState(metaStateBuff);

    if(await this.isExistStateHexInDB(hexState)){
      throw new StateAlreadyExists();
    }

    const { functions } = await getStateMeta(metaStateBuff);
    const funcNames = Object.keys(functions);

    const createMetaDataInput = plainToClass(State, {
      code: program.code,
      name,
      hexWasmState: hexState,
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

  private async isExistStateHexInDB(stateHex: Hex): Promise<boolean> {
    if (process.env.TEST_ENV_UNIT) {
      return false;
    }

    const state = await this.stateRepository.getByHexWasmState(stateHex);

    return !!state;
  }
}
