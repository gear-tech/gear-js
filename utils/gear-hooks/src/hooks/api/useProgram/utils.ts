import { GearApi } from '@gear-js/api';
import { UnsubscribePromise } from '@polkadot/api/types';

import { ProgramStatus } from './types';

const waitForProgramInit = (api: GearApi, programId: string) => {
  let unsubPromise: UnsubscribePromise;

  const unsubscribe = async () => (await unsubPromise)();

  return new Promise<string>((resolve) => {
    unsubPromise = api.gearEvents.subscribeToGearEvent('ProgramChanged', ({ data }) => {
      if (data.id.eq(programId)) {
        if (data.change.isActive) {
          resolve(ProgramStatus.Success);
        } else if (data.change.isTerminated) {
          resolve(ProgramStatus.Failed);
        }
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- TODO(#1816): resolve eslint comments
  }).finally(unsubscribe);
};

export { waitForProgramInit };
