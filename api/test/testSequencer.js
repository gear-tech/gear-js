import * as Sequencer from '@jest/test-sequencer';

export default class CustomSequencer extends Sequencer.default.default {
  sort(tests) {
    const copyTests = Array.from(tests);
    return copyTests.sort((testA, testB) => (testA.path > testB.path ? 1 : -1));
  }
}
