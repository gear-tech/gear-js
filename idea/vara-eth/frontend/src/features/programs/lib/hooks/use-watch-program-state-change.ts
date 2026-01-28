import { useMutation } from '@tanstack/react-query';
import { HexString, ProgramState } from '@vara-eth/api';

import { useMirrorContract } from '@/app/api';
import { useVaraEthApi } from '@/app/providers';

const UNWATCH_TIMEOUT_MS = 60000;

type Params = {
  name: string;
  isChanged: (currentState: ProgramState, incomingState: ProgramState) => boolean;
};

const useWatchProgramStateChange = (programId: HexString) => {
  const { api } = useVaraEthApi();
  const { data: mirrorContract } = useMirrorContract(programId);

  const watch = async ({ name, isChanged }: Params) => {
    if (!api) throw new Error('API is not intialized');
    if (!mirrorContract) throw new Error('Mirror contract is not found');

    const currentStateHash = await mirrorContract.stateHash();
    const currentState = await api.query.program.readState(currentStateHash);

    return new Promise<void>((resolve, reject) => {
      let unwatch = () => {};

      const timeoutId = setTimeout(() => {
        unwatch();
        reject(new Error(`No ${name} changes detected`));
      }, UNWATCH_TIMEOUT_MS);

      const cleanup = () => {
        clearTimeout(timeoutId);
        unwatch();
      };

      unwatch = mirrorContract.watchStateChangedEvent((stateHash) => {
        api.query.program
          .readState(stateHash)
          .then((state) => {
            if (isChanged(currentState, state)) {
              cleanup();
              resolve();
            }
          })
          .catch((error) => {
            cleanup();
            reject(error instanceof Error ? error : new Error(String(error)));
          });
      });
    });
  };

  return useMutation({ mutationFn: watch });
};

export { useWatchProgramStateChange };
