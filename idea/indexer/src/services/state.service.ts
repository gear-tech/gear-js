import {
  AddStateParams,
  AddStateResult,
  GetAllStateParams,
  GetStateByCodeParams,
  GetStateParams,
  GetStatesResult,
} from '@gear-js/common';
import { DataSource, Repository } from 'typeorm';
import { generateCodeHash, getStateMetadata } from '@gear-js/api';

import { State } from '../database';
import { ProgramNotFound, StateAlreadyExists, StateNotFound } from '../common';
import { ProgramService } from './program.service';

export class StateService {
  private repo: Repository<State>;

  constructor(dataSource: DataSource, private programService: ProgramService) {
    this.repo = dataSource.getRepository(State);
  }

  public async get({ id }: GetStateParams): Promise<State> {
    const state = await this.repo.findOneBy({ id });

    if (!state) {
      throw new StateNotFound();
    }

    return state;
  }

  public async listByProgramId({ programId, genesis }: GetAllStateParams): Promise<GetStatesResult> {
    const program = await this.programService.get({ id: programId, genesis });

    if (!program) {
      throw new ProgramNotFound();
    }

    const codeId = program.codeId;

    const options = { where: { codeId } };

    const [states, count] = await Promise.all([this.repo.find(options), this.repo.count(options)]);

    return {
      states,
      count,
    };
  }

  public async create({ genesis, programId, wasmBuffBase64, name }: AddStateParams): Promise<AddStateResult> {
    const program = await this.programService.get({ id: programId, genesis });

    const metaStateBuff = Buffer.from(wasmBuffBase64, 'base64');
    const stateId = generateCodeHash(metaStateBuff);

    if (await this.repo.findOneBy({ id: stateId })) {
      throw new StateAlreadyExists();
    }

    const { functions } = await getStateMetadata(metaStateBuff);
    const funcNames = Object.keys(functions);

    const state = await this.repo.save(
      new State({
        id: stateId,
        name,
        wasmBuffBase64,
        funcNames,
        functions,
        codeId: program.codeId,
      }),
    );

    return {
      status: 'State added',
      state: {
        id: state.id,
        name: state.name,
        wasmBuffBase64: state.wasmBuffBase64,
        functions: state.functions,
      },
    };
  }
}
