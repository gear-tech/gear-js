import { nanoid } from 'nanoid';
import {
  AddMetaParams,
  AddPayloadParams,
  FindMessageParams,
  FindProgramParams,
  GetAllProgramsParams,
  GetAllUserProgramsParams,
  GetIncomingMessagesParams,
  GetMessagesParams,
  GetMetaParams,
  GetOutgoingMessagesParams,
  GetTestBalanceParams,
  KAFKA_TOPICS,
} from '@gear-js/common';

import { kafkaEventMap } from './kafka-event-map';
import { kafkaProducer } from './producer';

async function programData(params: FindProgramParams) {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.PROGRAM_DATA, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function programMetaAdd(params: AddMetaParams) {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.PROGRAM_META_ADD, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function programMetaGet(params: GetMetaParams) {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.PROGRAM_META_GET, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function programAll(params: GetAllProgramsParams) {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.PROGRAM_ALL, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function programAllUsers(params: GetAllUserProgramsParams) {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.PROGRAM_ALL_USER, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function messageAll(params: GetMessagesParams) {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.MESSAGE_ALL, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function messageData(params: FindMessageParams) {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.MESSAGE_DATA, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function messageAddPayload(params: AddPayloadParams) {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.MESSAGE_ADD_PAYLOAD, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function messageIncoming(params: GetIncomingMessagesParams) {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.MESSAGE_ALL, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function messageOutGoing(params: GetOutgoingMessagesParams) {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.MESSAGE_ALL, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

async function testBalance(params: GetTestBalanceParams) {
  const correlationId: string = nanoid(6);
  await kafkaProducer.sendByTopic(KAFKA_TOPICS.TEST_BALANCE_GET, correlationId, params);

  let topicEvent;
  const res = new Promise((resolve) => (topicEvent = resolve));
  kafkaEventMap.set(correlationId, topicEvent);
  return res;
}

export {
  programData,
  programMetaAdd,
  programMetaGet,
  programAll,
  programAllUsers,
  messageAll,
  messageData,
  messageIncoming,
  messageOutGoing,
  messageAddPayload,
  testBalance,
};
