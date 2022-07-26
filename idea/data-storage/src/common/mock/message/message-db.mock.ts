import { load } from 'js-yaml';
import { readFileSync } from 'fs';

import { Message } from '../../../database/entities';

function getMessagesDBMock(): Message[] {
  const pathMessages = '/messages.mock.yaml';
  let result: Message[] = [];

  (async function (){
    try {
      const collectionMessages = load(readFileSync(__dirname + pathMessages, 'utf8'));
      const keys = Object.keys(collectionMessages);

      for (const key of keys) {
        result = collectionMessages[key];
      }
    } catch (err) {
      console.error(err);
    }
  })();

  return result;
}

const MESSAGE_DB_MOCK = getMessagesDBMock();

export { MESSAGE_DB_MOCK };
