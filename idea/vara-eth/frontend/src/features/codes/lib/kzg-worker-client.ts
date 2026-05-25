import type { Hex } from 'viem';

let worker: Worker | undefined;
let requestId = 0;

function getWorker(): Worker {
  if (!worker) {
    console.log('creating KZG worker');
    worker = new Worker(new URL('./kzg.worker.ts', import.meta.url), {
      type: 'module',
    });
  }
  return worker;
}

function callWorker<T = void>(type: string, payload?: unknown): Promise<T> {
  const id = ++requestId;
  const w = getWorker();

  return new Promise<T>((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.id !== id) return;

      w.removeEventListener('message', handleMessage);

      if (event.data.type.endsWith(':error')) {
        reject(new Error(event.data.error));
        return;
      }

      resolve(event.data.result as T);
    };

    w.addEventListener('message', handleMessage);
    w.postMessage({ id, type, payload });
  });
}

let kzgReadyPromise: Promise<void> | undefined;

export function initKzgInWorker(): Promise<void> {
  if (!kzgReadyPromise) {
    kzgReadyPromise = callWorker('init');
  }
  return kzgReadyPromise;
}

export function computeBlobHashesInWorker(code: Uint8Array): Promise<Hex[]> {
  return callWorker<Hex[]>('computeBlobHashes', { code });
}
