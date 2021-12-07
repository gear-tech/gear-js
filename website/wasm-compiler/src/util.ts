const AdmZip = require('adm-zip');
import { mkdirSync } from 'fs';
import { join } from 'path';
import config from './config/configuration';

export function isWasm(fileName: string): boolean {
  let ext = fileName.split('.');
  return ext[ext.length - 1] === 'wasm';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2);
}

export function unpackZip(file: Buffer, id: string): string {
  const zip = new AdmZip(file);
  const path = join(config().wasmBuild.rootFolder, id);
  mkdirSync(path, { recursive: true });
  zip.extractAllTo(path);
  return path;
}

export function packZip(
  files: { fileName: string; content: Buffer }[],
): Buffer {
  const zip = new AdmZip();
  files.forEach((file) => {
    zip.addFile(file.fileName, Buffer.alloc(file.content.length, file.content));
  });
  return zip.toBuffer();
}
