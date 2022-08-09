import { Hex } from '@gear-js/api';
import { expect } from 'chai';

import request from './request';
import { Passed } from '../interfaces';

export async function getAllMessages(genesis: string, messagesIds: Hex[]): Promise<Passed> {
  const response = await request('message.all', { genesis, limit: 100 });
  expect(response).to.have.own.property('result');
  expect(response.result).to.have.all.keys(['messages', 'count']);
  expect(response.result.count).to.eq(messagesIds.length);
  return true;
}

export async function getMessageData(genesis: string, messageId: Hex) {
  const response = await request('message.data', { genesis, id: messageId });
  expect(response).to.have.own.property('result');
  expect(response.result).to.have.all.keys([
    'id',
    'blockHash',
    'genesis',
    'timestamp',
    'destination',
    'source',
    'payload',
    'entry',
    'expiration',
    'replyToMessageId',
    'exitCode',
    'processedWithPanic',
    'value',
    'type',
    'readStatus',
  ]);
  return true;
}

export async function getMessagePayload(genesis: string, messageId: Hex) {
  const response = await request('message.data', { genesis, id: messageId });
  expect(response).to.have.own.property('result');
  expect(response.result).to.have.key('payload');
  expect(response.result.payload).to.exist('payload');
  return true;
}
