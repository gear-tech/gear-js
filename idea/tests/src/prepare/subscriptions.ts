import { CodeChangedData, GearApi, Hex, UserMessageSentData } from '@gear-js/api';
import { UnsubscribePromise } from '@polkadot/api/types';

async function listenToUserMessageSent(
  api: GearApi,
  callback: (logData: UserMessageSentData) => void,
): UnsubscribePromise {
  return await api.gearEvents.subscribeToGearEvent('UserMessageSent', (event) => {
    callback(event.data);
  });
}

async function listenToMessagesDispatched(api: GearApi, callback: (id: Hex, success: boolean) => void) {
  return api.gearEvents.subscribeToGearEvent('MessagesDispatched', ({ data: { statuses } }) => {
    statuses.forEach((status, messageId) => {
      callback(messageId.toHex(), status.isSuccess ? true : false);
    });
  });
}

async function listenToCodeChanged(api: GearApi,  callback: (logData: CodeChangedData) => void ) {
  return api.gearEvents.subscribeToGearEvent('CodeChanged', (event) => {
    callback(event.data);
  });
}

export { listenToUserMessageSent, listenToMessagesDispatched, listenToCodeChanged };
