import type { TestSequencer, TestSpecification } from 'vitest/node';

export default class CustomSequencer implements TestSequencer {
  async sort(files: TestSpecification[]): Promise<TestSpecification[]> {
    return [...files].sort((a, b) => {
      const priority = (spec: TestSpecification): number => {
        if (spec.moduleId.endsWith('GearApi.test.ts')) return 0;
        if (spec.moduleId.endsWith('Code.test.ts')) return 1;
        if (spec.moduleId.endsWith('Message.test.ts')) return 2;
        return 3;
      };
      return priority(a) - priority(b);
    });
  }

  async shard(files: TestSpecification[]): Promise<TestSpecification[]> {
    return files;
  }
}
