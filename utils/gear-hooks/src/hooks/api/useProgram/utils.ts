import { GearApi } from '@gear-js/api';
import { UnsubscribePromise } from '@polkadot/api/types';
import { Event } from '@polkadot/types/interfaces';
import { ProgramStatus } from './types';

const getExtrinsicFailedMessage = (api: GearApi, event: Event) => {
  const { docs, method: errorMethod } = api.getExtrinsicFailedError(event);
  const formattedDocs = docs.filter(Boolean).join('. ');

  return `${errorMethod}: ${formattedDocs}`;
};

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
  }).finally(unsubscribe);
};

export { getExtrinsicFailedMessage, waitForProgramInit };
