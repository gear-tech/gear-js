import * as path from 'node:path';

export const ROOT_DIR = path.resolve(import.meta.dirname, '../');

export async function safeDisconnect(...resources) {
  for (const r of resources) {
    try {
      await r?.disconnect();
    } catch {}
  }
}
