import { cpSync, readFileSync, writeFileSync } from 'fs';
import { Target } from 'interfaces';
import { join } from 'path';

export function replaceEnvImport(filePath: string, target: Target): void {
  let data = readFileSync(filePath).toString();
  if (target === 'nodejs') {
    data = data.replace(`require('env')`, `require('./env.js')`);
  } else if (target === 'web') {
    data = data.replace(`import * as __wbg_star0 from 'env';`, `import __wbg_star0 from './env.js';`);
    data = data.replace(`const imports = {};`, `const imports = { wbg: {} };`);
  }
  writeFileSync(filePath, data);
}

export function writeEnvFile(pkgPath: string, ts: boolean, target: Target): void {
  if (target === 'nodejs') {
    cpSync('./templates/env.js', join(pkgPath, 'env.js'));
    ts && cpSync('./templates/env.d.ts', join(pkgPath, 'env.d.ts'));
  } else if (target === 'web') {
    cpSync('./templates/env.esm.js', join(pkgPath, 'env.js'));
  }
}
