import { IBaseDBRecord } from './common';
import { IMessage, IMessageEnqueuedData, IMessagesDispatchedData, IUserMessageReadData } from './message';
import { IProgramChangedData } from './program';
import { ICodeChangedData } from './code';
import { Keys } from '../enums';

interface NewEventData<K extends Keys, V> {
  key: K;
  value: V;
}

interface IMessageEnqueuedKafkaValue extends IMessageEnqueuedData, IBaseDBRecord<number> {}

interface ICodeChangedKafkaValue extends ICodeChangedData, IBaseDBRecord<number> {}

interface IUserMessageSentKafkaValue extends IMessage, IBaseDBRecord<number> {}

interface IUserMessageReadKafkaValue extends IUserMessageReadData, IBaseDBRecord<number> {}

interface IProgramChangedKafkaValue extends IProgramChangedData, IBaseDBRecord<number> {}

interface IMessagesDispatchedKafkaValue extends IMessagesDispatchedData, IBaseDBRecord<number> {}

export {
  NewEventData,
  IMessageEnqueuedKafkaValue,
  IUserMessageSentKafkaValue,
  IProgramChangedKafkaValue,
  IMessagesDispatchedKafkaValue,
  ICodeChangedKafkaValue,
  IUserMessageReadKafkaValue,
};
