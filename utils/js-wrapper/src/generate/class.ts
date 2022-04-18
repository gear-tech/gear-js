import { generateImports } from './imports.js';

export function generateClass(className: string, ts: boolean, functions: string[]): string {
  const result = [];
  result.push(generateImports(ts));
  result.push(
    ts
      ? `export class ${className} {
  api: GearApi;
  programId: ${'`0x${string}`'};
  isReady: Promise<string>;
  mod: any;
  providerAddress: string | undefined;\n
  ${functions.join('\n')}
}`
      : `export class ${className} {
  api;
  programId;
  isReady;
  mod;
  providerAddress;\n
  ${functions.join('\n')}
}`,
  );
  return result.join('\n');
}
