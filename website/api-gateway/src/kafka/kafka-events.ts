import {
  AddMetaParams,
  FindMessageParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetIncomingMessagesParams,
  GetMessagesParams,
  GetMetaParams,
  GetOutgoingMessagesParams,
  GetTestBalanceParams,
  GetAllUserProgramsParams,
} from '@gear-js/interfaces';
import { nanoid } from 'nanoid';

import { kafkaSendByTopic } from './kafka';
import { KAFKA_TOPICS } from '../common/kafka-producer-topics';
import { kafkaEventMap } from './kafka-event-map';

async function programData(params: FindProgramParams) {
  const correlationId: string = nanoid(6);
  await kafkaSendByTopic(KAFKA_TOPICS.PROGRAM_DATA, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function addMeta(params: AddMetaParams) {
  const correlationId: string = nanoid(6);
  await kafkaSendByTopic(KAFKA_TOPICS.META_ADD, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function getMeta(params: GetMetaParams) {
  const correlationId: string = nanoid(6);
  await kafkaSendByTopic(KAFKA_TOPICS.META_GET, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function programAll(params: GetAllProgramsParams) {
  const correlationId: string = nanoid(6);
  await kafkaSendByTopic(KAFKA_TOPICS.PROGRAM_ALL, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function programAllUsers(params: GetAllUserProgramsParams) {
  const correlationId: string = nanoid(6);
  await kafkaSendByTopic(KAFKA_TOPICS.PROGRAM_ALL_USER, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function messageAll(params: GetMessagesParams) {
  const correlationId: string = nanoid(6);
  await kafkaSendByTopic(KAFKA_TOPICS.MESSAGE_ALL, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function messageData(params: FindMessageParams) {
  const correlationId: string = nanoid(6);
  await kafkaSendByTopic(KAFKA_TOPICS.MESSAGE_DATA, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function messageIncoming(params: GetIncomingMessagesParams) {
  const correlationId: string = nanoid(6);
  await kafkaSendByTopic(KAFKA_TOPICS.MESSAGE_ALL, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function messageOutGoing(params: GetOutgoingMessagesParams) {
  const correlationId: string = nanoid(6);
  await kafkaSendByTopic(KAFKA_TOPICS.MESSAGE_ALL, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function testBalance(params: GetTestBalanceParams) {
  const correlationId: string = nanoid(6);
  await kafkaSendByTopic(KAFKA_TOPICS.TEST_BALANCE_GET, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

export {
  programData,
  addMeta,
  getMeta,
  programAll,
  programAllUsers,
  messageAll,
  messageData,
  messageIncoming,
  messageOutGoing,
  testBalance,
};
