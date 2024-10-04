import { MessageFromProgram, MessageToProgram } from 'indexer-db';
import { DataSource, Repository } from 'typeorm';

import { Pagination } from '../decorators';
import {
  ResManyResult,
  ParamGetMsgsFromProgram,
  ParamGetMsgsToProgram,
  ParamMsgFromProgram,
  ParamMsgToProgram,
} from '../types';
import { MessageNotFound } from '../errors';
import { RequiredParams } from '../decorators/required';

export class MessageService {
  private _repoTo: Repository<MessageToProgram>;
  private _repoFrom: Repository<MessageFromProgram>;

  constructor(dataSource: DataSource) {
    this._repoTo = dataSource.getRepository(MessageToProgram);
    this._repoFrom = dataSource.getRepository(MessageFromProgram);
  }

  @RequiredParams(['id'])
  async getMsgTo({ id }: ParamMsgToProgram): Promise<MessageToProgram> {
    const m = await this._repoTo.findOne({ where: { id } });

    if (!m) {
      throw new MessageNotFound();
    }

    return m;
  }

  @RequiredParams(['id'])
  async getMsgFrom({ id }: ParamMsgFromProgram): Promise<MessageFromProgram> {
    const m = await this._repoFrom.findOne({ where: { id } });

    if (!m) {
      throw new MessageNotFound();
    }

    return m;
  }

  @Pagination()
  async getMsgsTo({
    source,
    destination,
    entry,
    limit,
    offset,
    service,
    fn,
  }: ParamGetMsgsToProgram): Promise<ResManyResult<MessageToProgram>> {
    const qb = this._repoTo.createQueryBuilder('msg');

    if (source) {
      qb.andWhere('msg.source = :source', { source });
    }

    if (destination) {
      qb.andWhere('msg.destination = :destination', { destination });
    }

    if (entry) {
      qb.andWhere('msg.entry = :entry', { entry });
    }

    if (service) {
      qb.andWhere('msg.service ILIKE :service', { service: `%${service.toLowerCase()}%` });
    }

    if (fn) {
      qb.andWhere('msg.fn ILIKE :fn', { fn: `%${fn.toLowerCase()}%` });
    }

    qb.orderBy('msg.timestamp', 'DESC').limit(limit).offset(offset);

    const [result, count] = await Promise.all([qb.getMany(), qb.getCount()]);

    return {
      result,
      count,
    };
  }

  @Pagination()
  async getMsgsFrom({
    source,
    destination,
    parentId,
    isInMailbox,
    limit,
    offset,
    service,
    fn,
  }: ParamGetMsgsFromProgram): Promise<ResManyResult<MessageFromProgram>> {
    const qb = this._repoFrom.createQueryBuilder('msg');

    if (source) {
      qb.andWhere('msg.source = :source', { source });
    }

    if (destination) {
      qb.andWhere('msg.destination = :destination', { destination });
    }

    if (parentId) {
      qb.andWhere('msg.parent_id = :parentId', { parentId });
    }

    if (isInMailbox) {
      qb.andWhere('msg.readReson = NULL').andWhere('msg.expiration != NULL');
    }

    if (service) {
      qb.andWhere('msg.service ILIKE :service', { service: `%${service.toLowerCase()}%` });
    }

    if (fn) {
      qb.andWhere('msg.fn ILIKE :fn', { fn: `%${fn.toLowerCase()}%` });
    }

    qb.orderBy('msg.timestamp', 'DESC').limit(limit).offset(offset);

    const [result, count] = await Promise.all([qb.getMany(), qb.getCount()]);

    return {
      result,
      count,
    };
  }
}
