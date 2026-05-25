import type { DataCache } from 'gear-idea-common';
import { cacheKey, Event } from 'gear-idea-indexer-db';
import type { DataSource, Repository } from 'typeorm';

import { Pagination } from '../decorators/index.js';
import { RequiredParams } from '../decorators/required.js';
import { EventNotFound } from '../errors/index.js';
import type { ParamGetEvent, ParamGetEvents, ResManyResult } from '../types/index.js';
import { hexToBuffer } from '../utils.js';

export class EventService {
  private _repo: Repository<Event>;
  private readonly _genesis: string;
  private readonly _dataCache: DataCache;

  constructor(dataSource: DataSource, genesis: string, dataCache: DataCache) {
    this._repo = dataSource.getRepository(Event);
    this._genesis = genesis;
    this._dataCache = dataCache;
  }

  @RequiredParams(['id'])
  async getEvent({ id }: ParamGetEvent): Promise<Event> {
    const e = await this._repo.findOne({ where: { id } });

    if (!e) {
      throw new EventNotFound();
    }

    return e;
  }

  @Pagination()
  async getEvents({
    source,
    parentId,
    service,
    name,
    limit,
    offset,
    from,
    to,
  }: ParamGetEvents): Promise<ResManyResult<Event>> {
    const builder = this._repo.createQueryBuilder('event');

    if (source) {
      builder.andWhere('event.source = :source', { source: hexToBuffer(source) });
    }

    if (parentId) {
      builder.andWhere('event.parentId = :parentId', { parentId: hexToBuffer(parentId) });
    }

    if (service) {
      builder.andWhere('event.service ILIKE :service', { service: `%${service.toLowerCase()}%` });
    }

    if (name) {
      builder.andWhere('event.name ILIKE :name', { name: `%${name.toLowerCase()}%` });
    }

    if (from) {
      builder.andWhere('event.timestamp >= :from', { from });
    }

    if (to) {
      builder.andWhere('event.timestamp <= :to', { to });
    }

    builder.orderBy('event.timestamp', 'DESC').take(limit).skip(offset);

    const simpleSourceQuery = source && !parentId && !service && !name && !from && !to;
    const getCount = simpleSourceQuery
      ? () => this._dataCache.getNumber(cacheKey.eventsSource(this._genesis, source), () => builder.getCount())
      : () => builder.getCount();

    const [result, count] = await Promise.all([builder.getMany(), getCount()]);

    return { result, count };
  }
}
