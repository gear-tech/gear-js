import { IBaseDBRecord, IGenesis } from './common';
import { IMessage, IMessageEnqueuedData, IMessagesDispatchedData } from './message';
import { IProgram, IProgramChangedData } from './program';

export enum Keys {
  MessageEnqueued = 'MessageEnqueued',
  UserMessageSent = 'UserMessageSent',
  MessagesDispatched = 'MessagesDispatched',
  ProgramChanged = 'ProgramChanged',
  CodeChanged = 'CodeChanged',
  DatabaseWiped = 'DatabaseWiped',
}

export interface NewEventData<K extends Keys, V> {
  key: K;
  value: V;
}

export interface IMessageEnqueuedKafkaValue extends IMessageEnqueuedData, IBaseDBRecord<number> {}

export interface IUserMessageSentKafkaValue extends IMessage, IBaseDBRecord<number> {}

export interface IProgramChangedKafkaValue extends IProgramChangedData, IBaseDBRecord<number> {}

export interface IMessagesDispatchedKafkaValue extends IMessagesDispatchedData, IBaseDBRecord<number> {}
