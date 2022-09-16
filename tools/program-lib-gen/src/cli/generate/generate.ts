import { TypeInfoRegistry } from '@gear-js/api';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { Scheme } from '../interfaces/scheme.js';
import { CodeGen } from './code-gen.js';
import { generateTypes } from './types-gen.js';

function mkDirs(path: string) {
  const generatedPath = join(path, 'generated');
  if (!existsSync(generatedPath)) {
    mkdirSync(generatedPath, { recursive: true });
  }
  return generatedPath;
}

export default function (pathToScheme: string, outPath: string) {
  const scheme: Scheme = JSON.parse(readFileSync(pathToScheme, 'utf-8'));

  const typeInfo = new TypeInfoRegistry(scheme.registry);

  const generatedPath = mkDirs(outPath);

  const codeGen = new CodeGen(scheme, typeInfo, generatedPath);
  codeGen.generate();
  codeGen.save();

  generateTypes(typeInfo, generatedPath);
}
