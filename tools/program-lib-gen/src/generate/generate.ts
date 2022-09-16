import { TypeInfoRegistry } from '@gear-js/api';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { Scheme } from '../interfaces/scheme.js';
import { CodeGen } from './code-gen.js';
import { writeTemplate } from './templates/write-template.js';
import { generateTypes } from './types-gen.js';

function mkDirs(path: string) {
  const generatedPath = join(path, 'generated');
  const entries = join(generatedPath, 'entries');
  if (!existsSync(entries)) {
    mkdirSync(entries, { recursive: true });
  }
  return [generatedPath, entries];
}

export default function (pathToScheme: string, outPath: string) {
  const scheme: Scheme = JSON.parse(readFileSync(pathToScheme, 'utf-8'));

  const typeInfo = new TypeInfoRegistry(scheme.registry);

  const [generatedPath, entries] = mkDirs(outPath);

  const codeGen = new CodeGen(scheme, typeInfo, generatedPath);
  const templates = codeGen.generate();
  codeGen.save();

  generateTypes(typeInfo, generatedPath);

  for (const template of templates) {
    writeTemplate(template, entries);
  }
}
