import * as Sequencer from '@jest/test-sequencer';

export default class CustomSequencer extends Sequencer.default.default {
  sort(tests) {
    if (test.length === 1) return tests;

    const copyTests = Array.from(tests);
    const result = new Array(copyTests.length);

    const apiTest = tests.find(({ path }) => path.endsWith('GearApi.test.ts'));
    const codeTest = tests.find(({ path }) => path.endsWith('Code.test.ts'));
    const messageTest = tests.find(({ path }) => path.endsWith('Message.test.ts'));

    let counter = 0;

    if (apiTest && tests.length > 1) counter++;
    if (codeTest && tests.length > 1) counter++;
    if (messageTest && tests.length > 1) counter++;

    for (const test of copyTests) {
      if (test.path.endsWith('GearApi.test.ts') && tests.length > 1) {
        result[0] = test;
        continue;
      } else if (test.path.endsWith('Code.test.ts') && tests.length > 1) {
        result[1] = test;
        continue;
      } else if (test.path.endsWith('Message.test.ts') && test.length > 1) {
        result[2] = test;
        continue;
      } else {
        result[counter] = test;
        counter++;
      }
    }

    return result;
  }
}
