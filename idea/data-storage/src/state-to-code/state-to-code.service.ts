import { Injectable } from '@nestjs/common';
import { HexString } from '@polkadot/util/types';
import { plainToClass } from 'class-transformer';

import { StateToCodeRepo } from './state-to-code.repo';
import { Code, State, StateToCode } from '../database/entities';
import { StateNotFound } from '../common/errors/state';
import { GetStateByCodeParams } from '@gear-js/common';

@Injectable()
export class StateToCodeService {
  constructor(private stateToCodeRepository: StateToCodeRepo) {}

  public async getByCodeIdAndStateId(params: GetStateByCodeParams): Promise<StateToCode> {
    const { codeId, stateId } = params;
    const stateToCode = await this.stateToCodeRepository.getByCodeIdAndStateId(codeId, stateId);

    if(!stateToCode) throw new StateNotFound();

    return stateToCode;
  }

  public async create(code: Code, state: State, stateHex: HexString): Promise<StateToCode> {
    const stateToCode = plainToClass(StateToCode, { code, codeId: code._id, state, stateHex: stateHex });

    return this.stateToCodeRepository.save(stateToCode);
  }

  public async isExistStateHexByCode(stateHex: HexString, codeId: string): Promise<boolean> {
    const stateToCode = await this.stateToCodeRepository.getByCodeIdAndStateHex(codeId, stateHex);

    return !!stateToCode;
  }
}
