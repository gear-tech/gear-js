import { IBaseDBRecord } from './common';
import { IMessage, IMessageQueuedData, IMessagesDispatchedData, IUserMessageReadData } from './message';
import { IProgramChangedData } from './program';
import { ICodeChangedData } from './code';
import { EventNames } from '../enums';

interface NewEventData<K extends EventNames, V> {
  key: K;
  value: V;
}

interface IMessageQueuedKafkaValue extends IMessageQueuedData, IBaseDBRecord<number> {}

interface ICodeChangedKafkaValue extends ICodeChangedData, IBaseDBRecord<number> {}

interface IUserMessageSentKafkaValue extends IMessage, IBaseDBRecord<number> {}

interface IUserMessageReadKafkaValue extends IUserMessageReadData, IBaseDBRecord<number> {}

interface IProgramChangedKafkaValue extends IProgramChangedData, IBaseDBRecord<number> {}

interface IMessagesDispatchedKafkaValue extends IMessagesDispatchedData, IBaseDBRecord<number> {}

export {
  NewEventData,
  IMessageQueuedKafkaValue,
  IUserMessageSentKafkaValue,
  IProgramChangedKafkaValue,
  IMessagesDispatchedKafkaValue,
  ICodeChangedKafkaValue,
  IUserMessageReadKafkaValue,
};
