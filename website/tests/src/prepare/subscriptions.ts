import { GearApi, LogData, MessageInfo, Reason } from '@gear-js/api';
import { UnsubscribePromise } from '@polkadot/api/types';

export async function listenLog(api: GearApi, callback: (logData: LogData) => void): UnsubscribePromise {
  return await api.gearEvents.subscribeToLogEvents((event) => {
    callback(event.data);
  });
}

export async function listenInit(
  api: GearApi,
  callback: (info: MessageInfo, reason?: Reason) => void,
): UnsubscribePromise {
  return api.gearEvents.subscribeToProgramEvents((event) => {
    callback(event.data.info, event.data.reason);
  });
}
