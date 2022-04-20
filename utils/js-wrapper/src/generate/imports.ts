import { Target } from '../interfaces.js';

export function generateImports(ts: boolean, target: Target) {
  const result = [];
  result.push(
    target === 'nodejs' ? `const { GearApi } = require('@gear-js/api');` : `import { GearApi } from '@gear-js/api';`,
  );
  if (ts) {
    result.push(
      target === 'nodejs'
        ? `const { SubmittableExtrinsic } = require('@polkadot/api/types');`
        : `import { SubmittableExtrinsic } from '@polkadot/api/types';`,
    );
    result.push(
      target === 'nodejs'
        ? `const { ISubmittableResult } = require('@polkadot/types/types');`
        : `import { ISubmittableResult } from '@polkadot/types/types';`,
    );
  }
  result.push(
    target === 'nodejs' ? `const rust = require('./wrapper.js');\n` : `const rust = import('./wrapper.js');\n`,
  );
  return result.join('\n');
}
