import { Event } from 'gear-idea-indexer-db';
import { DataSource, Repository } from 'typeorm';
import { Pagination } from '../decorators';
import { ParamGetEvent, ParamGetEvents, ResManyResult } from '../types';
import { EventNotFound } from '../errors';
import { RequiredParams } from '../decorators/required';

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
  async getEvents({ source, parentId, service, name, limit, offset }: ParamGetEvents): Promise<ResManyResult<Event>> {
    const builder = this._repo.createQueryBuilder('event');

    if (source) {
      builder.andWhere('event.source = :source', { source });
    }

    if (parentId) {
      builder.andWhere('event.parent_id = :parentId', { parentId });
    }

    if (service) {
      builder.andWhere('event.service ILIKE :service', { service: `%${service.toLowerCase()}%` });
    }

    if (name) {
      builder.andWhere('event.name ILIKE :name', { name: `%${name.toLowerCase()}%` });
    }

    builder.orderBy('event.timestamp', 'DESC').take(limit).skip(offset);

    const [result, count] = await Promise.all([builder.getMany(), builder.getCount()]);

    return {
      result,
      count,
    };
  }
}
