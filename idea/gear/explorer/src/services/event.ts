import { Event } from 'gear-idea-indexer-db';
import { DataSource, Repository } from 'typeorm';
import { Pagination } from '../decorators/index.js';
import { ParamGetEvent, ParamGetEvents, ResManyResult } from '../types/index.js';
import { EventNotFound } from '../errors/index.js';
import { RequiredParams } from '../decorators/required.js';
import { hexToBuffer } from '../utils.js';

export class EventService {
  private _repo: Repository<Event>;

  constructor(dataSource: DataSource) {
    this._repo = dataSource.getRepository(Event);
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

    const [result, count] = await Promise.all([builder.getMany(), builder.getCount()]);

    return {
      result,
      count,
    };
  }
}
