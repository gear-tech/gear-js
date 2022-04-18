import { cpSync, readdirSync, rmSync } from 'fs';
import { Paths, Target } from './interfaces.js';
import { join } from 'path';

const REGEXP = {
  dts: new RegExp(/\/\w+\.d\.ts/),
  js: new RegExp(/\w+\.js/),
};

export function getPaths(path: string): Paths {
  const splitted = path.split('/');
  const result: Paths = {
    pkgPath: undefined,
    declarationPath: undefined,
    modPath: undefined,
    name: undefined,
  };
  const ext = pathExt(path);
  if (ext === null) {
    result.pkgPath = path;
    const files = readdirSync(path);
    files.forEach((element) => {
      const elemPath = join(path, element);
      if (elemPath.match(REGEXP.dts)) {
        result.declarationPath = elemPath;
      } else if (elemPath.match(REGEXP.js)) {
        result.modPath = elemPath;
      }
    });
    result.name = result.modPath.split('/').at(-1).split('.')[0];
  } else {
    result.pkgPath = splitted.slice(0, -1).join('/');
    result.modPath = path.replace(ext, '.js');
    result.declarationPath = path.replace(ext, '.d.ts');
    result.name = result.modPath.split('/').at(-1).replace(ext, '');
  }
  result.name = result.name.replace(/^\w/, (c) => c.toUpperCase());
  return result;
}

function pathExt(path: string): string | null {
  for (let ext of ['.wasm', '.d.ts', '.js', '.wasm.d.ts']) {
    if (path.endsWith(ext)) {
      return ext;
    }
  }
  return null;
}

export function writePackageJson(pathToPkg: string, target: Target) {
  if (['web', 'bundler'].includes(target)) {
    cpSync('templates/package.json', join(pathToPkg, 'package.json'));
  }
}

export function rmPackageJson(pathToPkg: string, target: Target) {
  if (target === 'web') {
    rmSync(join(pathToPkg, 'package.json'));
  }
}
