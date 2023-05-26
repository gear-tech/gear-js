import { UnsubscribePromise } from '@polkadot/api/types';
import { GearApi } from '@gear-js/api';
import { ProgramStatus } from 'entities/program';

const waitForProgramInit = (api: GearApi, programId: string) => {
  let unsubPromise: UnsubscribePromise;

  const unsubscribe = async () => (await unsubPromise)();

  return new Promise<string>((resolve) => {
    unsubPromise = api.gearEvents.subscribeToGearEvent('ProgramChanged', ({ data }) => {
      if (data.id.eq(programId)) {
        if (data.change.isActive) {
          resolve(ProgramStatus.Active);
        } else if (data.change.isTerminated) {
          resolve(ProgramStatus.Terminated);
        }
      }
    });
  }).finally(unsubscribe);
};

export { waitForProgramInit };
