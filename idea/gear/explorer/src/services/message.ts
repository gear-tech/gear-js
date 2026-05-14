import type { DataCache } from 'gear-idea-common';
import { cacheKey, MessageFromProgram, MessageToProgram } from 'gear-idea-indexer-db';
import type { DataSource, Repository } from 'typeorm';

import { Pagination } from '../decorators/index.js';
import { RequiredParams } from '../decorators/required.js';
import { InvalidParams, MessageNotFound } from '../errors/index.js';
import type {
  ParamGetMsgsFromProgram,
  ParamGetMsgsToProgram,
  ParamMsgFromProgram,
  ParamMsgToProgram,
  ResManyResult,
} from '../types/index.js';
import { hexToBuffer, isHex } from '../utils.js';

export class MessageService {
  private _repoTo: Repository<MessageToProgram>;
  private _repoFrom: Repository<MessageFromProgram>;
  private readonly _genesis: string;
  private readonly _dataCache: DataCache;

  constructor(dataSource: DataSource, genesis: string, dataCache: DataCache) {
    this._repoTo = dataSource.getRepository(MessageToProgram);
    this._repoFrom = dataSource.getRepository(MessageFromProgram);
    this._genesis = genesis;
    this._dataCache = dataCache;
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
    query,
    from,
    to,
  }: ParamGetMsgsToProgram): Promise<ResManyResult<MessageToProgram>> {
    const qb = this._repoTo.createQueryBuilder('msg');

    if (source) {
      qb.andWhere('msg.source = :source', { source: hexToBuffer(source) });
    }

    if (destination) {
      qb.andWhere('msg.destination = :destination', { destination: hexToBuffer(destination) });
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

    if (query) {
      if (!isHex(query)) throw new InvalidParams('Message ID must be a hex string');

      qb.andWhere('msg.id = :query', { query: hexToBuffer(query) });
    }

    if (from) {
      qb.andWhere('msg.timestamp >= :from', { from });
    }

    if (to) {
      qb.andWhere('msg.timestamp <= :to', { to });
    }

    qb.orderBy('msg.timestamp', 'DESC').limit(limit).offset(offset);

    const simpleDestQuery = destination && !source && !entry && !service && !fn && !from && !to && !query;
    const getCount = simpleDestQuery
      ? () => this._dataCache.getNumber(cacheKey.messagesToDestination(this._genesis, destination), () => qb.getCount())
      : () => qb.getCount();

    const [result, count] = await Promise.all([qb.getMany(), getCount()]);

    return { result, count };
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
    query,
    from,
    to,
  }: ParamGetMsgsFromProgram): Promise<ResManyResult<MessageFromProgram>> {
    const qb = this._repoFrom.createQueryBuilder('msg');

    if (source) {
      qb.andWhere('msg.source = :source', { source: hexToBuffer(source) });
    }

    if (destination) {
      qb.andWhere('msg.destination = :destination', { destination: hexToBuffer(destination) });
    }

    if (parentId) {
      qb.andWhere('msg.parentId = :parentId', { parentId: hexToBuffer(parentId) });
    }

    if (isInMailbox) {
      qb.andWhere('msg.readReason IS NULL').andWhere('msg.expiration IS NOT NULL');
    }

    if (service) {
      qb.andWhere('msg.service ILIKE :service', { service: `%${service.toLowerCase()}%` });
    }

    if (fn) {
      qb.andWhere('msg.fn ILIKE :fn', { fn: `%${fn.toLowerCase()}%` });
    }

    if (query) {
      if (!isHex(query)) throw new InvalidParams('Message ID must be a hex string');

      qb.andWhere('msg.id = :query', { query: hexToBuffer(query) });
    }

    if (from) {
      qb.andWhere('msg.timestamp >= :from', { from });
    }

    if (to) {
      qb.andWhere('msg.timestamp <= :to', { to });
    }

    qb.orderBy('msg.timestamp', 'DESC').limit(limit).offset(offset);

    const simpleSourceQuery =
      source && !destination && !parentId && !isInMailbox && !service && !fn && !from && !to && !query;
    const getCount = simpleSourceQuery
      ? () => this._dataCache.getNumber(cacheKey.messagesFromSource(this._genesis, source), () => qb.getCount())
      : () => qb.getCount();

    const [result, count] = await Promise.all([qb.getMany(), getCount()]);

    return { result, count };
  }
}
