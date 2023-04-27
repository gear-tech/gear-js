import {
  AddStateParams,
  AddStateResult,
  GetAllStateParams,
  GetStateByCodeParams,
  GetStateParams,
  GetStatesResult,
} from '@gear-js/common';
import { DataSource, Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { generateCodeHash, getStateMetadata } from '@gear-js/api';

import { Code, State, StateToCode } from '../database';
import { ProgramNotFound, StateAlreadyExists, StateNotFound } from '../common';
import { ProgramService } from './program.service';

export class StateService {
  private repo: Repository<State>;
  private stateToCodeRepo: Repository<StateToCode>;

  constructor(dataSource: DataSource, private programService: ProgramService) {
    this.repo = dataSource.getRepository(State);
    this.stateToCodeRepo = dataSource.getRepository(StateToCode);
  }

  public async get({ id }: GetStateParams): Promise<State> {
    const state = await this.repo.findOneBy({ id });

    if (!state) {
      throw new StateNotFound();
    }

    return state;
  }

  public async listByProgramId({ programId, genesis, query }: GetAllStateParams): Promise<GetStatesResult> {
    const program = await this.programService.get({ id: programId, genesis });

    if (!program) {
      throw new ProgramNotFound();
    }

    const codeId = program.code.id;

    const [states, count] =
      query && query.length >= 1
        ? await this.repo
          .createQueryBuilder('state')
          .select(['state.id', 'state.name', 'state.functions'])
          .innerJoin('state.stateToCodes', 'stateToCodes')
          .innerJoin('stateToCodes.code', 'code', 'code.id = :id', { id: codeId })
          .where(`LOWER(("state"."funcNames")::text) like LOWER('%${query}%')`)
          .orderBy('state.name', 'ASC')
          .getManyAndCount()
        : await this.repo.findAndCount({
          where: { stateToCodes: { code: { id: codeId } } },
          select: { functions: true, name: true, id: true },
          order: { name: 'ASC' },
        });

    return {
      states,
      count,
    };
  }

  public async create({ genesis, programId, wasmBuffBase64, name }: AddStateParams): Promise<AddStateResult> {
    const program = await this.programService.get({ id: programId, genesis });

    const metaStateBuff = Buffer.from(wasmBuffBase64, 'base64');
    const hexState = generateCodeHash(metaStateBuff);

    if (await this.isExistStateHexByCode(hexState, program.code.id)) {
      throw new StateAlreadyExists();
    }

    const { functions } = await getStateMetadata(metaStateBuff);
    const funcNames = Object.keys(functions);

    const createMetaDataInput = plainToClass(State, {
      name,
      wasmBuffBase64,
      funcNames,
      functions,
    });

    const state = await this.repo.save(createMetaDataInput);

    await this.createStateToCode(program.code, state, hexState);

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

  public async getByCodeIdAndStateId({ codeId, stateId }: GetStateByCodeParams): Promise<StateToCode> {
    const stateToCode = await this.stateToCodeRepo.findOne({
      where: {
        code: { id: codeId },
        stateId,
      },
      relations: ['state'],
    });

    if (!stateToCode) throw new StateNotFound();

    return stateToCode;
  }

  public async createStateToCode(code: Code, state: State, stateHex: string): Promise<StateToCode> {
    const stateToCode = plainToInstance(StateToCode, { code, codeId: code._id, state, stateHex: stateHex });

    return this.stateToCodeRepo.save(stateToCode);
  }

  public async isExistStateHexByCode(stateHex: string, codeId: string): Promise<boolean> {
    const stateToCode = await this.stateToCodeRepo.findOne({
      where: {
        code: { id: codeId },
        stateHex,
      },
    });

    return !!stateToCode;
  }
}
