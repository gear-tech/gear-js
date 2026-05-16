/**
 * Generic Promise.race-with-timeout. Caller supplies an error factory so the
 * thrown error carries call-site-specific context (txHash, codeId, etc.) and
 * preserves typed-error semantics — there's no single one-size "timeout" error
 * worth blessing as the default.
 *
 * On the success path, `clearTimeout` releases the timer so jest's open-handle
 * detector stays clean and the test process exits without `--forceExit`.
 */
export async function withTimeout<T>(promise: Promise<T>, ms: number, makeError: () => Error): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(makeError()), ms);
      }),
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}
