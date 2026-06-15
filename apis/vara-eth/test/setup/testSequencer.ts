import type { TestSequencer, TestSpecification } from 'vitest/node';

export default class CustomSequencer implements TestSequencer {
  async sort(files: TestSpecification[]): Promise<TestSpecification[]> {
    return [...files].sort((a, b) => {
      const priority = (spec: TestSpecification): number => {
        if (spec.moduleId.includes('wvara')) return 0;
        if (spec.moduleId.includes('router')) return 1;
        if (spec.moduleId.includes('create-program-builder')) return 2;
        return 3;
      };
      return priority(a) - priority(b);
    });
  }

  async shard(files: TestSpecification[]): Promise<TestSpecification[]> {
    return files;
  }
}
