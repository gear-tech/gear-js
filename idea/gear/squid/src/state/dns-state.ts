import type { Store } from '@subsquid/typeorm-store';

import { config } from '../config.js';
import type { AdminAddedEvent, AdminRemovedEvent, ProgramDeletedEvent, ProgramIdChangedEvent } from '../dns-parser.js';
import { DnsEventType, type DnsParser, getDnsParser, type NewProgramAddedEvent } from '../dns-parser.js';
import { Dns, DnsEvent, DnsProgram } from '../model/index.js';
import type { ProcessorContext } from '../processor.js';

export class DnsState {
  private _programs: Map<string, DnsProgram>;
  private _deletedProgramIds: Set<string>;
  private _events: DnsEvent[];
  private _ctx: ProcessorContext<Store>;
  private _parser?: DnsParser;
  private _dnsSaved = false;

  constructor() {
    this._programs = new Map();
    this._deletedProgramIds = new Set();
    this._events = [];
  }

  async init(): Promise<void> {
    this._parser = await getDnsParser();
  }

  async newBatch(ctx: ProcessorContext<Store>) {
    this._ctx = ctx;
    this._programs.clear();
    this._deletedProgramIds.clear();
    this._events = [];
  }

  async save() {
    if (this._deletedProgramIds.size > 0) {
      await this._ctx.store.remove(DnsProgram, Array.from(this._deletedProgramIds));
    }
    if (this._programs.size > 0) {
      await this._ctx.store.save(Array.from(this._programs.values()));
    }
    if (this._events.length > 0) {
      await this._ctx.store.save(this._events);
    }
    await this.saveDns();

    if (this._deletedProgramIds.size || this._programs.size || this._events.length) {
      this._ctx.log.info(
        {
          programs: this._programs.size || undefined,
          deletedPrograms: this._deletedProgramIds.size || undefined,
          events: this._events.length || undefined,
        },
        'DNS data saved',
      );
    }
  }

  addProgram(program: DnsProgram) {
    this._ctx.log.debug({ id: program.id, name: program.name, address: program.address }, 'addDnsProgram');
    this._programs.set(program.id, program);
  }

  updateProgram(program: DnsProgram) {
    this._ctx.log.debug({ id: program.id, name: program.name, address: program.address }, 'updateDnsProgram');
    this._programs.set(program.id, program);
  }

  deleteProgram(id: string) {
    this._ctx.log.debug({ id }, 'deleteDnsProgram');
    this._programs.delete(id);
    this._deletedProgramIds.add(id);
  }

  async getProgram(name: string): Promise<DnsProgram | undefined> {
    if (this._deletedProgramIds.has(name)) return undefined;
    if (this._programs.has(name)) {
      return this._programs.get(name);
    }
    const program = await this._ctx.store.findOneBy(DnsProgram, { id: name });
    if (program) {
      this._programs.set(name, program);
    }
    return program;
  }

  private async _updateProgram(
    name: string,
    updater: (program: DnsProgram) => void,
    eventLabel: string,
  ): Promise<void> {
    const program = await this.getProgram(name);
    if (program) {
      updater(program);
      this.updateProgram(program);
    } else {
      this._ctx.log.warn({ name }, `${eventLabel}: program not found`);
    }
  }

  addEvent(event: DnsEvent) {
    this._events.push(event);
  }

  handleNewProgramAdded(event: NewProgramAddedEvent, timestamp: Date): void {
    const program = new DnsProgram({
      id: event.name,
      name: event.name,
      address: event.program,
      admins: event.admins,
      createdBy: event.admins[0] ?? '',
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    this.addProgram(program);
  }

  async handleProgramIdChanged(event: ProgramIdChangedEvent, timestamp: Date): Promise<void> {
    await this._updateProgram(
      event.name,
      (p) => {
        p.address = event.program;
        p.admins = event.admins;
        p.updatedAt = timestamp;
      },
      'ProgramIdChanged',
    );
  }

  handleProgramDeleted(event: ProgramDeletedEvent): void {
    this.deleteProgram(event.name);
  }

  async handleAdminAdded(event: AdminAddedEvent, timestamp: Date): Promise<void> {
    await this._updateProgram(
      event.name,
      (p) => {
        p.admins = event.admins;
        p.updatedAt = timestamp;
      },
      'AdminAdded',
    );
  }

  async handleAdminRemoved(event: AdminRemovedEvent, timestamp: Date): Promise<void> {
    await this._updateProgram(
      event.name,
      (p) => {
        p.admins = event.admins;
        p.updatedAt = timestamp;
      },
      'AdminRemoved',
    );
  }

  async handleEvent(
    payload: string,
    eventInfo: { blockNumber: string; txHash: string; timestamp: Date },
  ): Promise<void> {
    if (!this._parser) {
      throw new Error('DnsState not initialized');
    }

    const dnsEvent = this._parser.parseEvent(payload as `0x${string}`);

    if (!dnsEvent) {
      return;
    }

    const eventEntity = new DnsEvent({
      id: crypto.randomUUID(),
      type: dnsEvent.type,
      raw: JSON.stringify(dnsEvent, (_, value) => (typeof value === 'bigint' ? value.toString() : value)),
      blockNumber: eventInfo.blockNumber,
      txHash: eventInfo.txHash,
      timestamp: eventInfo.timestamp,
    });

    this.addEvent(eventEntity);

    switch (dnsEvent.type) {
      case DnsEventType.NewProgramAdded:
        this.handleNewProgramAdded(dnsEvent, eventInfo.timestamp);
        break;
      case DnsEventType.ProgramIdChanged:
        await this.handleProgramIdChanged(dnsEvent, eventInfo.timestamp);
        break;
      case DnsEventType.ProgramDeleted:
        this.handleProgramDeleted(dnsEvent);
        break;
      case DnsEventType.AdminAdded:
        await this.handleAdminAdded(dnsEvent, eventInfo.timestamp);
        break;
      case DnsEventType.AdminRemoved:
        await this.handleAdminRemoved(dnsEvent, eventInfo.timestamp);
        break;
      default:
        this._ctx.log.warn({ type: (dnsEvent as any).type }, 'Unhandled DNS event type');
    }
  }

  async saveDns(): Promise<void> {
    if (this._dnsSaved) return;
    const existing = await this._ctx.store.findOneBy(Dns, {});
    if (!existing) {
      await this._ctx.store.save(new Dns({ id: 'dns', address: config.dns.programAddress }));
    }
    this._dnsSaved = true;
  }
}
