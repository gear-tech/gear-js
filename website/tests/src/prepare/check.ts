import { Hex } from '@gear-js/api';
import assert from 'assert';

import { IMessageSpec, IPreparedPrograms, IUploadedPrograms } from '../interfaces';

export function checkPrograms(
  programs: { [id: Hex]: IUploadedPrograms },
  initSuccess: Map<string, boolean>,
): IPreparedPrograms {
  const result: IPreparedPrograms = {};

  for (let id of Object.keys(programs)) {
    assert(initSuccess.has(programs[id].messageId), `InitStatus of ${id} program not found`);
    assert(programs[id].shouldSuccess === initSuccess.get(programs[id].messageId), `InitStatus of ${id} doesn't match`);

    result[id] = {
      spec: programs[id],
      init: initSuccess.get(programs[id].messageId),
      id: id,
    };
  }
  return result;
}

export function checkMessages(sentMessages: Map<number, any>, specMessages: { [program: string]: IMessageSpec[] }) {
  assert(
    Object.keys(specMessages).reduce((counter, key) => {
      counter += specMessages[key].length;
      return counter;
    }, 0) === sentMessages.size,
    `Some messages wasn't sent`,
  );
  return sentMessages;
}

export function checkUserMessageSent(
  specMessages: { [program: string]: IMessageSpec[] },
  checkUserMessageSentMessages: Map<Hex, any>,
) {
  assert(
    Object.keys(specMessages).reduce((counter, key) => {
      counter += specMessages[key].reduce((count, value) => {
        if (value.log) {
          count += 1;
        }
        return count;
      }, 0);
      return counter;
    }, 0) === checkUserMessageSentMessages.size,
    `Some logs wasn't received`,
  );
  return checkUserMessageSentMessages;
}
