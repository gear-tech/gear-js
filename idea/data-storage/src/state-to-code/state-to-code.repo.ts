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

  public async getByCodeIdAndStateId(codeId: string, stateId: string): Promise<StateToCode> {
    return this.stateToCodeRepo.findOne({
      where: {
        code: { id: codeId },
        stateId,
      },
      relations: ['state']
    });
  }

  public async getByCodeIdAndStateHex(codeId: string, stateHex: string): Promise<StateToCode> {
    return this.stateToCodeRepo.findOne({
      where: {
        code: { id: codeId },
        stateHex,
      } });
  }

  public async save(stateToCode: StateToCode): Promise<StateToCode> {
    return this.stateToCodeRepo.save(stateToCode);
  }
}
