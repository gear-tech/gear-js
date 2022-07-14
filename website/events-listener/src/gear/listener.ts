import { GearApi } from '@gear-js/api';
import { GenericEventData } from '@polkadot/types';
import { GEAR_EVENT } from '@gear-js/common';

import { eventListenerLogger } from '../common';
import { handleEvent } from './event-handlers';

export const listen = (api: GearApi, genesis: string, callback: (arg: { key: string; value: any }) => void) => {
  return api.query.system.events(async (events) => {
    const blockHash = events.createdAtHash!.toHex();
    const timestamp = await api.blocks.getBlockTimestamp(blockHash!);
    const base = {
      genesis,
      blockHash,
      timestamp: timestamp.toNumber(),
    };

    events.forEach(async ({ event: { data, method } }) => {
      try {
        const eventData = handleEvent(method as GEAR_EVENT, data as GenericEventData);
        eventData !== null && callback({ key: eventData.key, value: { ...eventData.value, ...base } });
      } catch (error) {
        eventListenerLogger.error({ method, data: data.toHuman() });
        eventListenerLogger.error(error);
      }
    });
  });
};
