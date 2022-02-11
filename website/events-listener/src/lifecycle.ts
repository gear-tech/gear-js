//
// An app-wide promise that could be awaited somewhere and resolved elsewhere.
// Once `setRestartNeeded` is called, a new promise takes place instead of
// the current `restartIfNeeded`, which could be awaited as well.
//

/** Bring the module into the state it were before a `setRestartNeeded` call. */
const reset = () => {
  let resolve: () => void;
  const promise = new Promise<void>((x) => {
    resolve = x;
  });

  restartIfNeeded = promise;
  setRestartNeeded = () => {
    resolve();
    reset();
  };
};

/** Await this in an event loop. */
export let restartIfNeeded: Promise<void>;

/** Trigger a restart in all event loops that were awaiting for this one. */
export let setRestartNeeded: () => void;

reset();
