import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Subject } from 'rxjs';
import { fromBytes } from 'src/gear-node/utils';
import { ProgramsService } from 'src/programs/programs.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { NodeEvent } from './entities/event.entity';

@Injectable()
export class EventsService {
  eventSubject: Subject<any>;
  api: ApiPromise;
  provider: WsProvider;
  types: any;

  constructor(
    private readonly userService: UsersService,
    private readonly programService: ProgramsService,
    @InjectRepository(NodeEvent)
    private readonly eventRepository: Repository<NodeEvent>,
  ) {
    this.eventSubject = new Subject();
  }

  init(api: ApiPromise, provider: WsProvider, types: any) {
    this.api = api;
    this.provider = provider;
    this.types = types;
  }

  async log({ id, source, dest, payload, reply, date, type }) {
    const user = await this.userService.findOneByPublicKey(dest);
    if (!user) {
      return;
    }
    const program = await this.programService.getProgram(source);
    if (program.expectedType) {
      payload = await fromBytes(this.api, program.expectedType, payload);
    }
    this.eventSubject.next({
      type: type,
      date: date,
      program: source,
      dest: dest,
      payload: payload,
    });
    const event = this.eventRepository.create({
      id: id,
      destination: user,
      program: source,
      payload: payload,
      date: date,
      type: type,
    });
    return this.eventRepository.save(event);
  }

  async program({ type, method, programHash, date }) {
    const program = await this.programService.getProgram(programHash);
    if (!program) {
      return;
    }
    const user = await this.userService.findOne(program.user.id);
    if (!user) {
      return;
    }

    this.eventSubject.next({
      type: method,
      date: date,
      program: programHash,
      dest: user.publicKey,
    });

    const event = this.eventRepository.create({
      id: programHash,
      destination: user,
      type: method,
      program: program,
      date: date,
    });

    if (method === 'InitFailure') {
      this.programService.removeProgram(programHash);
    }
    return this.eventRepository.save(event);
  }

  async getUserEventsPagination(
    user,
    query,
  ): Promise<{ events: NodeEvent[]; count: number }> {
    const { limit, offset } = query;

    const [result, total] = await this.eventRepository.findAndCount({
      where: { destination: user },
      take: limit || 13,
      skip: offset || 0,
    });

    return {
      events: result,
      count: total,
    };
  }

  async getCountUnreadEvents(user) {
    const events = await this.eventRepository.find({
      destination: user,
      isRead: false,
    });
    return events.length;
  }
}
