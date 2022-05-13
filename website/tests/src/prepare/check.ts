import { Hex } from '@gear-js/api';
import assert from 'assert';

import { IMessageSpec, IPreparedPrograms, IUploadedPrograms } from '../interfaces';

export function checkPrograms(
  programs: { [id: Hex]: IUploadedPrograms },
  initSuccess: Map<string, boolean>,
): IPreparedPrograms {
  const result: IPreparedPrograms = {};

  Object.keys(programs).forEach((id) => {
    assert(initSuccess.has(id), `InitStatus of ${id} program not found`);
    assert(programs[id as Hex].shouldSuccess === initSuccess.get(id), `InitStatus of ${id} doesn't match`);

    result[id as Hex] = {
      spec: programs[id as Hex],
      init: initSuccess.get(id) as boolean,
      id: id as Hex,
    };
  });
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

export function checkLogs(specMessages: { [program: string]: IMessageSpec[] }, logMessages: Map<Hex, any>) {
  assert(
    Object.keys(specMessages).reduce((counter, key) => {
      counter += specMessages[key].reduce((count, value) => {
        if (value.log) {
          count += 1;
        }
        return count;
      }, 0);
      return counter;
    }, 0) === logMessages.size,
    `Some logs wasn't received`,
  );
  return logMessages;
}
