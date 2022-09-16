import { writeFileSync } from 'fs';
import { join } from 'path';
import { getHandleTemplate } from './handle.entry.js';
import { getInitTemplate } from './init.entry.js';
import { getReplyTemplate } from './reply.entry.js';
import { getBaseTemplate } from './base.js';

export function writeTemplate(entry: 'init' | 'handle' | 'reply' | 'state' | 'base', _path: string) {
  const filename = `${entry}.entry.ts`;
  const getTemplate = {
    handle: getHandleTemplate,
    init: getInitTemplate,
    reply: getReplyTemplate,
    base: getBaseTemplate,
  };
  writeFileSync(join(_path, filename), getTemplate[entry]());
}
