import Sequencer from '@jest/test-sequencer';

export default class CustomSequencer extends Sequencer {
  sort(tests) {
    return Array.from(tests).sort((testA, testB) => {
      const getPriority = (test) => {
        if (test.path.includes('wvara')) return 0;
        if (test.path.includes('router')) return 1;
        if (test.path.includes('create-program-builder')) return 2;
        return 3;
      };

      const priorityA = getPriority(testA);
      const priorityB = getPriority(testB);

      return priorityA - priorityB;
    });
  }
}
