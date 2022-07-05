import { IBaseDBRecord } from './common';
import { IMessage, IMessageEnqueuedData, IMessagesDispatchedData } from './message';
import { IProgramChangedData } from './program';
import { ICodeChangedData } from './code';

enum Keys {
  MessageEnqueued = 'MessageEnqueued',
  UserMessageSent = 'UserMessageSent',
  UserMessageRead = 'UserMessageRead',
  MessagesDispatched = 'MessagesDispatched',
  ProgramChanged = 'ProgramChanged',
  CodeChanged = 'CodeChanged',
  DatabaseWiped = 'DatabaseWiped',
}

interface NewEventData<K extends Keys, V> {
  key: K;
  value: V;
}

interface IMessageEnqueuedKafkaValue extends IMessageEnqueuedData, IBaseDBRecord<number> {}

interface ICodeChangedKafkaValue extends ICodeChangedData, IBaseDBRecord<number> {}

interface IUserMessageSentKafkaValue extends IMessage, IBaseDBRecord<number> {}

interface IProgramChangedKafkaValue extends IProgramChangedData, IBaseDBRecord<number> {}

interface IMessagesDispatchedKafkaValue extends IMessagesDispatchedData, IBaseDBRecord<number> {}

export {
  Keys,
  NewEventData,
  IMessageEnqueuedKafkaValue,
  IUserMessageSentKafkaValue,
  IProgramChangedKafkaValue,
  IMessagesDispatchedKafkaValue,
  ICodeChangedKafkaValue,
};
