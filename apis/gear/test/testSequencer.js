import * as Sequencer from '@jest/test-sequencer';

export default class CustomSequencer extends Sequencer.default.default {
  sort(tests) {
    const copyTests = Array.from(tests);
    const result = new Array(copyTests.length);

    const apiTest = tests.find(({ path }) => path.includes('GearApi'));
    const codeTest = tests.find(({ path }) => path.includes('Code'));

    let counter = 0;

    if (apiTest && tests.length > 1) counter++;
    if (codeTest && tests.length > 1) counter++;

    for (const test of copyTests) {
      if (test.path.includes('GearApi') && tests.length > 1) {
        result[0] = test;
        continue;
      } else if (test.path.includes('Code') && tests.length > 1) {
        result[1] = test;
        continue;
      } else {
        result[counter] = test;
        counter++;
      }
    }

    return result;
  }
}
