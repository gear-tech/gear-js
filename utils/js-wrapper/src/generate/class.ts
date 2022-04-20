import { Target } from '../interfaces.js';
import { generateImports } from './imports.js';
import { getType } from './utils.js';

export function generateClass(className: string, ts: boolean, functions: string[], target: Target): string {
  const result = [];
  result.push(generateImports(ts, target));
  if (target === 'nodejs' && !ts) {
    result.push(
      `module.exports.${className} = class ${className} {
  api;
  programId;
  isReady;
  mod;
  providerAddress;\n
  ${functions.join('\n')}
}`,
    );
  } else {
    result.push(
      `export class ${className} {
  api${getType(': GearApi', ts)};
  programId${getType(': `0x${string}`', ts)};
  isReady${getType(': Promise<string>', ts)};
  mod${getType(': any', ts)};
  providerAddress${getType(': string | undefined', ts)};\n
  ${functions.join('\n')}
}`,
    );
  }
  return result.join('\n');
}
