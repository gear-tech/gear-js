import { useMutation } from '@tanstack/react-query';
import { HexString, ProgramState } from '@vara-eth/api';

import { useMirrorContract } from '@/app/api';
import { useVaraEthApi } from '@/app/providers';

const useWatchProgramStateChange = (programId: HexString) => {
  const { api } = useVaraEthApi();
  const { data: mirrorContract } = useMirrorContract(programId);

  const watchFn = async (isChanged: (currentState: ProgramState, incomingState: ProgramState) => boolean) => {
    if (!api) throw new Error('API is not intialized');
    if (!mirrorContract) throw new Error('Mirror contract is not found');

    const currentStateHash = await mirrorContract.stateHash();
    const currentState = await api.query.program.readState(currentStateHash);

    return new Promise<void>((resolve, reject) => {
      const unwatch = mirrorContract.watchStateChangedEvent((stateHash) => {
        api.query.program
          .readState(stateHash)
          .then((state) => {
            if (isChanged(currentState, state)) {
              unwatch();
              resolve();
            }
          })
          .catch((error) => {
            unwatch();
            reject(error instanceof Error ? error : new Error(String(error)));
          });
      });
    });
  };

  return useMutation({ mutationFn: watchFn });
};

export { useWatchProgramStateChange };
