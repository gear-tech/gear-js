import { useMutation } from '@tanstack/react-query';
import { ProgramState } from '@vara-eth/api';
import { useRef, useEffect } from 'react';
import { Hex } from 'viem';

import { useMirrorContract, useApi } from '@/app/api';

class TimeoutError extends Error {
  constructor(name: string) {
    super(`Timed out ${name} changes detection`);
    this.name = 'WatchProgramStateChangeTimeoutError';
  }
}

class CancelError extends Error {
  constructor(name: string) {
    super(`Cancelled ${name} changes detection`);
    this.name = 'WatchProgramStateChangeCancelError';
  }
}

const UNWATCH_TIMEOUT_MS = 180_000;

type Params = {
  name: string;
  isChanged: (currentState: ProgramState, incomingState: ProgramState) => boolean;
};

const useWatchProgramStateChange = (programId: Hex) => {
  const { data: api } = useApi();
  const mirrorContract = useMirrorContract(programId);

  const cleanUpRef = useRef(() => {});

  const watch = async ({ name, isChanged }: Params) => {
    if (!api) throw new Error('API is not initialized');
    if (!mirrorContract) throw new Error('Mirror contract is not found');

    // mutation not intended to be used simultaneously or by multiple watchers per one hook,
    // clean up just in case
    cleanUpRef.current();

    const currentStateHash = await mirrorContract.stateHash();
    const currentState = await api.query.program.readState(currentStateHash);

    return new Promise<void>((resolve, reject) => {
      let isFinished = false;
      let unwatch = () => {};

      const cleanUp = <T>(settle: (param?: T) => void, param?: T) => {
        if (isFinished) return;

        isFinished = true;
        cleanUpRef.current = () => {};

        clearTimeout(timeoutId);
        unwatch();
        settle(param);
      };

      const timeoutId = setTimeout(() => cleanUp(reject, new TimeoutError(name)), UNWATCH_TIMEOUT_MS);
      cleanUpRef.current = () => cleanUp(reject, new CancelError(name));

      const handleChange = (stateHash: Hex) => {
        if (isFinished) return;

        api.query.program
          .readState(stateHash)
          .then((state) => {
            if (isFinished || !isChanged(currentState, state)) return;

            cleanUp(resolve);
          })
          .catch((error) => {
            if (isFinished) return;

            cleanUp(reject, error instanceof Error ? error : new Error(String(error)));
          });
      };

      unwatch = mirrorContract.watchStateChangedEvent(handleChange);
    });
  };

  useEffect(() => () => cleanUpRef.current(), []);

  return useMutation({ mutationFn: watch });
};

export { useWatchProgramStateChange };
