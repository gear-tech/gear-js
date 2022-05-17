import { GearKeyring, getWasmMetadata, Hex } from '@gear-js/api';
import { u8aToHex } from '@polkadot/util';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import request from './request';
import { IPreparedProgram, Passed } from '../interfaces';
import accounts from '../config/accounts';

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
    'error',
    'replyTo',
    'replyError',
  ]);
  return true;
}

export async function incomingMessages() {}

export async function outgoingMessages() {}
