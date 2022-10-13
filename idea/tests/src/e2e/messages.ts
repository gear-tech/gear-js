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

export async function getMessagesByDates(genesis: string, date: Date): Promise<Passed> {
  const fromDate = new Date(date);
  fromDate.setMinutes(fromDate.getMinutes() - 5);

  const toDate = new Date(date);
  toDate.setMinutes(toDate.getMinutes() + 5);

  const response = await request('message.all', { genesis, fromDate, toDate, limit: 100 });

  const isValidMessagesDate = response.result.messages.reduce((arr, message: any) => {
    const createdProgramDate = new Date(message.timestamp);
    if(createdProgramDate > fromDate && createdProgramDate < toDate) {
      arr.push(true);
    } else {
      arr.push(false);
    }
  }, []);

  expect(response).to.have.own.property('result');
  expect(response.result).to.have.all.keys(['messages', 'count']);

  expect(isValidMessagesDate.every(el => el === true)).to.eq(true);
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
    'readReason',
    'program'
  ]);
  return true;
}

export async function getMessagePayload(genesis: string, messageId: Hex) {
  const response = await request('message.data', { genesis, id: messageId });
  expect(response).to.have.own.property('result');
  expect(response.result).to.have.property('payload');
  expect(response.result.payload).to.exist;
  return true;
}
