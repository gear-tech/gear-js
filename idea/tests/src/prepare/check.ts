import { HexString } from '@polkadot/util/types';

import assert from 'assert';

import { ICodeSpec, IMessageSpec, IPreparedProgram, IPreparedPrograms, IUploadedPrograms } from '../interfaces';

function checkPrograms(
  programs: { [id: HexString]: IUploadedPrograms },
  initSuccess: Map<string, boolean>,
): IPreparedPrograms {
  const result: IPreparedPrograms = {};

  for (const id of Object.keys(programs)) {
    assert(initSuccess.has(id), `InitStatus of ${id} program not found`);
    assert(programs[id].shouldSuccess === initSuccess.get(id), `InitStatus of ${id} doesn't match`);

    result[id] = {
      spec: programs[id],
      init: initSuccess.get(id),
      id,
      owner: programs[id].owner,
    } as IPreparedProgram;
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

function checkUserMessageSent(specMessages: { [program: string]: IMessageSpec[] }, userSentMsgs: Map<HexString, any>) {
  assert(
    Object.keys(specMessages).reduce((counter, key) => {
      counter += specMessages[key].reduce((count, value) => {
        if (value.log) {
          count += 1;
        }
        if (value.autoReply) {
          count += 1;
        }
        return count;
      }, 0);
      return counter;
    }, 0) === userSentMsgs.size,
    "Some logs wasn't received",
  );
  return userSentMsgs;
}

function checkCollectionCode(
  sentCollectionCode: Map<HexString, any>,
  specCollectionCode: { [key: string]: ICodeSpec[] },
): Map<HexString, any> {
  assert(
    Object.keys(specCollectionCode).reduce((counter, key) => {
      counter += specCollectionCode[key].length;
      return counter;
    }, 0) === sentCollectionCode.size,
    "Some code wasn't sent",
  );
  return sentCollectionCode;
}

export { checkPrograms, checkMessages, checkUserMessageSent, checkCollectionCode };
