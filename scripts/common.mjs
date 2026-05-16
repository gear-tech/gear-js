import * as path from 'node:path';

export const ROOT_DIR = path.resolve(import.meta.dirname, '../');

export async function safeDisconnect(...resources) {
  for (const r of resources) {
    try {
      await r?.disconnect();
    } catch {}
  }
}

export function withTimeout(promise, label, timeoutMs) {
  let timer;
  const timeout = new Promise((_, rej) => {
    timer = setTimeout(() => rej(new Error(`${label}: timed out after ${timeoutMs}ms`)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
