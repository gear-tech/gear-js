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
        .where(`LOWER(("state"."funcNames")::text) like LOWER('%${query}%')`)
        .andWhere('state.code = :id', { id: codeId })
        .orderBy('state.name', 'ASC')
        .getManyAndCount();
    }
    return  this.stateRepo.findAndCount({
      where: { code: { id: codeId } },
      select: { functions: true, name: true, id: true }
    });
  }

  public async get(id: string): Promise<State> {
    return this.stateRepo.findOne({
      where: { id },
      select:['id', 'functions', 'wasmBuffBase64', 'name']
    });
  }

  public async save(metadata: State): Promise<State> {
    return this.stateRepo.save(metadata);
  }
}
