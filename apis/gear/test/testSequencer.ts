import type { TestSpecification } from 'vitest/node';
import { BaseSequencer } from 'vitest/node';

export default class CustomSequencer extends BaseSequencer {
  override async sort(files: TestSpecification[]): Promise<TestSpecification[]> {
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
}
