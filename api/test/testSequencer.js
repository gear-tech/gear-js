import * as Sequencer from '@jest/test-sequencer';

export default class CustomSequencer extends Sequencer.default.default {
  sort(tests) {
    const copyTests = Array.from(tests);
    const result = new Array(copyTests.length);

    let counter = 0;

    for (const test of copyTests) {
      if (test.path.includes('DebugMode')) {
        result[result.length - 1] = test;
        continue;
      } else if (test.path.includes('GearApi')) {
        result[0] = test;
        counter++;
        continue;
      } else {
        result[counter] = test;
        counter++;
      }
    }
    return result;
  }
}
