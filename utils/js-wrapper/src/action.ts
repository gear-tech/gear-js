import * as fs from 'fs';
import { generate, getFuncSignature, getFunctionsNames } from './generate/index.js';
import { join, resolve } from 'path';
import { getPaths, rmPackageJson, writePackageJson } from './utils.js';
import { replaceEnvImport, writeEnvFile } from './replaceEnv.js';
import { Target } from 'interfaces';

export async function processGenerate(path: string, ts: boolean, target: Target) {
  const { modPath, declarationPath, pkgPath, name } = getPaths(resolve(path));
  replaceEnvImport(modPath, target);
  writeEnvFile(pkgPath, ts, target);
  writePackageJson(pkgPath, target);

  const mod = await import(modPath);
  const declarationFile = fs.readFileSync(declarationPath);
  const functions = getFunctionsNames(mod);
  const result = generate(
    name,
    functions.map((name) => {
      return {
        name,
        ...getFuncSignature(name, declarationFile.toString()),
      };
    }),
    ts,
    target,
  );
  const resultFilePath = join(pkgPath, `index.${ts ? 'ts' : 'js'}`);
  fs.writeFileSync(resultFilePath, result);
  rmPackageJson(pkgPath, target);
}
