import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { HexString } from '@gear-js/api';
import { getFnNamePrefix, getServiceNamePrefix, Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';

const __dirname = join(fileURLToPath(import.meta.url), '..');

let instance: DnsParser | undefined;

export async function getDnsParser(): Promise<DnsParser> {
  if (!instance) {
    instance = new DnsParser();
    await instance.init();
  }
  return instance;
}

export enum DnsEventType {
  ProgramDeleted = 'ProgramDeleted',
  NewProgramAdded = 'NewProgramAdded',
  ProgramIdChanged = 'ProgramIdChanged',
  AdminAdded = 'AdminAdded',
  AdminRemoved = 'AdminRemoved',
}

export type NewProgramAddedEvent = {
  type: DnsEventType.NewProgramAdded;
  program: string;
  name: string;
  admins: string[];
};

export type ProgramIdChangedEvent = {
  type: DnsEventType.ProgramIdChanged;
  program: string;
  name: string;
  admins: string[];
};

export type ProgramDeletedEvent = {
  type: DnsEventType.ProgramDeleted;
  name: string;
};

export type AdminAddedEvent = {
  type: DnsEventType.AdminAdded;
  name: string;
  admins: string[];
};

export type AdminRemovedEvent = {
  type: DnsEventType.AdminRemoved;
  name: string;
  admins: string[];
};

export type DnsEvent =
  | ProgramDeletedEvent
  | NewProgramAddedEvent
  | ProgramIdChangedEvent
  | AdminAddedEvent
  | AdminRemovedEvent;

type ContractInfoChangedPayload = {
  name: string;
  contract_info: ContractInfo;
};

type ContractInfo = {
  admins: string[];
  program_id: string;
  registration_time: string;
};

export class DnsParser {
  private sails?: Sails;

  async init() {
    const idlPath = join(__dirname, '..', 'assets', 'dns.idl');
    const idl = readFileSync(idlPath, 'utf-8');
    const parser = new SailsIdlParser();
    await parser.init();
    const sails = new Sails(parser);
    sails.parseIdl(idl);
    this.sails = sails;
  }

  parseEvent(payload: HexString): DnsEvent | undefined {
    if (!this.sails) {
      throw new Error('Sails is not initialized');
    }
    const serviceName = getServiceNamePrefix(payload);
    const functionName = getFnNamePrefix(payload);
    if (!serviceName || !functionName) {
      return undefined;
    }
    const service = (this.sails as any).services[serviceName];
    if (!service) {
      return undefined;
    }
    const eventFn = service.events[functionName];
    if (!eventFn) {
      return undefined;
    }
    const ev = eventFn.decode(payload);
    switch (functionName) {
      case 'ProgramDeleted': {
        const event = ev as { name: string };
        return {
          type: DnsEventType.ProgramDeleted,
          name: event.name,
        };
      }
      case 'NewProgramAdded': {
        const event = ev as ContractInfoChangedPayload;
        return {
          type: DnsEventType.NewProgramAdded,
          program: event.contract_info.program_id.toString(),
          admins: event.contract_info.admins.map((a) => a.toString()),
          name: event.name,
        };
      }
      case 'ProgramIdChanged': {
        const event = ev as ContractInfoChangedPayload;
        return {
          type: DnsEventType.ProgramIdChanged,
          program: event.contract_info.program_id.toString(),
          admins: event.contract_info.admins.map((a) => a.toString()),
          name: event.name,
        };
      }
      case 'AdminAdded': {
        const event = ev as ContractInfoChangedPayload;
        return {
          type: DnsEventType.AdminAdded,
          admins: event.contract_info.admins.map((a) => a.toString()),
          name: event.name,
        };
      }
      case 'AdminRemoved': {
        const event = ev as ContractInfoChangedPayload;
        return {
          type: DnsEventType.AdminRemoved,
          admins: event.contract_info.admins.map((a) => a.toString()),
          name: event.name,
        };
      }
      default:
        return undefined;
    }
  }
}
