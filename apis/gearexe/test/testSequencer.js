import * as Sequencer from '@jest/test-sequencer';

export default class CustomSequencer extends Sequencer.default.default {
  sort(tests) {
    const copyTests = Array.from(tests);
    const result = new Array(copyTests.length);

    const routerTest = tests.find(({ path }) => path.includes('router'));

    let counter = 0;

    if (routerTest && tests.length > 1) counter++;

    for (const test of copyTests) {
      if (test.path.includes('router') && tests.length > 1) {
        result[0] = test;
        continue;
      } else {
        result[counter] = test;
        counter++;
      }
    }

    return result;
  }
}
