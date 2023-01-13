import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { State } from '../database/entities';

@Injectable()
export class StateRepo {
  constructor(
    @InjectRepository(State)
    private stateRepo: Repository<State>,
  ) {}

  public async list(codeId: string, query: string): Promise<[State[], number]> {
    if(query && query.length >= 1) {
      return this.stateRepo
        .createQueryBuilder('state')
        .select(['state.id', 'state.name', 'state.functions'])
        .innerJoin('state.stateToCodes', 'stateToCodes')
        .innerJoin('stateToCodes.code', 'code', 'code.id = :id', { id: codeId })
        .where(`LOWER(("state"."funcNames")::text) like LOWER('%${query}%')`)
        .orderBy('state.name', 'ASC')
        .getManyAndCount();
    }
    return  this.stateRepo.findAndCount({
      where: { stateToCodes: { code: { id: codeId } }  },
      select: { functions: true, name: true, id: true },
      order: { name: 'ASC' }
    });
  }

  public async get(id: string): Promise<State> {
    return this.stateRepo.findOne({
      where: { id },
      select: ['id', 'functions', 'wasmBuffBase64', 'name']
    });
  }

  public async save(metadata: State): Promise<State> {
    return this.stateRepo.save(metadata);
  }
}
