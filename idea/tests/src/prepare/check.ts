import { Hex } from '@gear-js/api';

import assert from 'assert';

import {
  ICodeSpec,
  IMessageSpec,
  IPreparedPrograms,
  IUploadedPrograms
} from '../interfaces';

function checkPrograms(
  programs: { [id: Hex]: IUploadedPrograms },
  initSuccess: Map<string, boolean>,
): IPreparedPrograms {
  const result: IPreparedPrograms = {};

  for (const id of Object.keys(programs)) {
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

function checkMessages(sentMessages: Map<number, any>, specMessages: { [program: string]: IMessageSpec[] }) {
  assert(
    Object.keys(specMessages).reduce((counter, key) => {
      counter += specMessages[key].length;
      return counter;
    }, 0) === sentMessages.size,
    "Some messages wasn't sent",
  );
  return sentMessages;
}

function checkUserMessageSent(
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
    "Some logs wasn't received",
  );
  return checkUserMessageSentMessages;
}

function checkCollectionCode(
  sentCollectionCode: Map<Hex, any>,
  specCollectionCode: { [key: string]: ICodeSpec[] }): Map<Hex, any> {
  assert(
    Object.keys(specCollectionCode).reduce((counter, key) => {
      counter += specCollectionCode[key].length;
      return counter;
    }, 0) === sentCollectionCode.size,
    "Some code wasn't sent",
  );
  return sentCollectionCode;
}

export  { checkPrograms, checkMessages, checkUserMessageSent,  checkCollectionCode };
