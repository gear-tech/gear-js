export function generateImports(ts: boolean) {
  const result = [];
  result.push(`import { GearApi } from '@gear-js/api';`);
  if (ts) {
    result.push(`import { SubmittableExtrinsic } from '@polkadot/api/types';`);
    result.push(`import { ISubmittableResult } from '@polkadot/types/types';`);
  }
  result.push(`const rust = import('./wrapper');\n`);
  return result.join('\n');
}
