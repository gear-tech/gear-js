import { Injectable } from '@nestjs/common';
import { Hex } from '@gear-js/api';
import { plainToClass } from 'class-transformer';
import * as dotenv from 'dotenv';

dotenv.config();
import { StateToCodeRepo } from './state-to-code.repo';
import { Code, State, StateToCode } from '../database/entities';

@Injectable()
export class StateToCodeService {
  constructor(private stateToCodeRepository: StateToCodeRepo) {}

  public async create(code: Code, state: State, stateHex: Hex): Promise<StateToCode> {
    const stateToCode = plainToClass(StateToCode, { code, codeId: code._id, state, hexWasmState: stateHex });

    return this.stateToCodeRepository.save(stateToCode);
  }

  public async isExistStateHexByCode(stateHex: Hex, codeId: string): Promise<boolean> {
    if (process.env.TEST_ENV_UNIT) {
      return false;
    }

    const stateToCode = await this.stateToCodeRepository.getByCodeIdAndStateHex(codeId, stateHex);

    return !!stateToCode;
  }
}
