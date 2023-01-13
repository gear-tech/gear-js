import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { StateToCode } from '../database/entities';

@Injectable()
export class StateToCodeRepo {
  constructor(
    @InjectRepository(StateToCode)
    private stateToCodeRepo: Repository<StateToCode>,
  ) {}

  public async getByCodeIdAndStateHex(codeId: string, stateHex: string): Promise<StateToCode> {
    return this.stateToCodeRepo.findOne({
      where: {
        code: { id: codeId },
        hexWasmState: stateHex,
      } });
  }

  public async save(stateToCode: StateToCode): Promise<StateToCode> {
    return this.stateToCodeRepo.save(stateToCode);
  }
}
