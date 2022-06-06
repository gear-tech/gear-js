const AdmZip = require('adm-zip');
import { mkdirSync } from 'fs';
import { join } from 'path';
import config from './configuration';

function isWasm(fileName: string): boolean {
  let ext = fileName.split('.');
  return ext[ext.length - 1] === 'wasm';
}

function generateId(): string {
  return Math.random().toString(36).substring(2);
}

function unpackZip(file: Buffer, id: string): string {
  const zip = new AdmZip(file);
  const path = join(config.compiler.rootFolder, id);
  mkdirSync(path, { recursive: true });
  zip.extractAllTo(path);
  return path;
}

function packZip(files: { fileName: string; content: Buffer }[]): Buffer {
  const zip = new AdmZip();
  files.forEach((file) => {
    zip.addFile(file.fileName, Buffer.alloc(file.content.length, file.content));
  });
  return zip.toBuffer();
}

export { isWasm, generateId, unpackZip, packZip };
