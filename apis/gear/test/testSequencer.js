import * as Sequencer from '@jest/test-sequencer';

export default class CustomSequencer extends Sequencer.default.default {
  sort(tests) {
    if (tests.length <= 1) return tests;

    const copyTests = Array.from(tests);

    const apiTest = copyTests.find(({ path }) => path.endsWith('GearApi.test.ts'));
    const codeTest = copyTests.find(({ path }) => path.endsWith('Code.test.ts'));
    const messageTest = copyTests.find(({ path }) => path.endsWith('Message.test.ts'));

    const remainingTests = copyTests.filter(
      (test) =>
        !test.path.endsWith('GearApi.test.ts') &&
        !test.path.endsWith('Code.test.ts') &&
        !test.path.endsWith('Message.test.ts'),
    );

    const result = [];

    if (apiTest) result.push(apiTest);
    if (codeTest) result.push(codeTest);
    if (messageTest) result.push(messageTest);

    result.push(...remainingTests);

    return result;
  }
}
