import { load } from 'js-yaml';
import { readFileSync } from 'fs';

import { Message } from '../../../src/database/entities';

function getMessagesDBMock(): Message[] {
  const pathMessages = '/messages.mock.yaml';
  try {
    return load(readFileSync(__dirname + pathMessages, 'utf8')) as Message[];
  } catch (err) {
    console.error(err);
  }
}

const MESSAGE_DB_MOCK = getMessagesDBMock();

export { MESSAGE_DB_MOCK };
