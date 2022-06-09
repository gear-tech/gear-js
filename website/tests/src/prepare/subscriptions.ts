import { GearApi, Hex, UserMessageSentData } from '@gear-js/api';
import { UnsubscribePromise } from '@polkadot/api/types';

export async function listenToUserMessageSent(
  api: GearApi,
  callback: (logData: UserMessageSentData) => void,
): UnsubscribePromise {
  return await api.gearEvents.subscribeToGearEvent('UserMessageSent', (event) => {
    callback(event.data);
  });
}

export async function listenToProgramChanged(
  api: GearApi,
  callback: (id: Hex, isActive: boolean) => void,
): UnsubscribePromise {
  return api.gearEvents.subscribeToGearEvent('ProgramChanged', (event) => {
    callback(event.data.id.toHex(), event.data.change.isActive);
  });
}
