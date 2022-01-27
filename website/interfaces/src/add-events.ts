import { IMessage } from './message';
import { IMessageInfo, IBaseDBRecord } from './general';
import { IGenesis } from './general';

export enum Keys {
  initMessage = 'InitMessageEnqueued',
  dispatchMessage = 'DispatchMessageEnqueued',
  log = 'Log',
  initSuccess = 'InitSuccess',
  initFailure = 'InitFailure',
  messageDispatched = 'MessageDispatched',
  dbWiped = 'DatabaseWiped',
}

export interface AddEventKafkaPayload<K extends Keys, V> {
  key: K;
  value: V;
}

export interface Log extends IMessage {}

export interface DispatchMessageEnqueud extends IBaseDBRecord<number>, IMessageInfo {}

export interface InitMessageEnqueued extends IBaseDBRecord<number>, IMessageInfo {}

export interface MessageDispatched extends IBaseDBRecord<number>, Pick<IMessageInfo, 'messageId'> {
  outcome: string;
}

export interface InitSuccess extends IBaseDBRecord<number>, IMessageInfo {}
export interface InitFailure extends IBaseDBRecord<number>, IMessageInfo {}
