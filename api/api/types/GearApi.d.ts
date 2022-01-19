import { GearProgram, GearMessage, GearBalance, GearEvents, GearMessageReply, GearProgramState } from '.';
import { GearApiOptions } from './interfaces';
import { ApiPromise } from '@polkadot/api';
import { EventRecord } from '@polkadot/types/interfaces';
import { PromiseResult } from '@polkadot/api/types';
import { Vec } from '@polkadot/types';
import { Observable } from 'rxjs';
export declare class GearApi extends ApiPromise {
  program: GearProgram;
  programState: GearProgramState;
  message: GearMessage;
  reply: GearMessageReply;
  balance: GearBalance;
  allEvents: PromiseResult<() => Observable<Vec<EventRecord>>>;
  gearEvents: GearEvents;
  defaultTypes: any;
  constructor(options?: GearApiOptions);
  static create(options?: GearApiOptions): Promise<GearApi>;
  totalIssuance(): Promise<string>;
  chain(): Promise<string>;
  nodeName(): Promise<string>;
  nodeVersion(): Promise<string>;
}
