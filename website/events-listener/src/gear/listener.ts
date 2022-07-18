import { GearApi } from '@gear-js/api';
import { GenericEventData } from '@polkadot/types';
import { API_METHODS, GEAR_EVENT } from '@gear-js/common';

import { eventListenerLogger } from '../common/event-listener.logger';
import { handleEvent } from './event-handlers';
import { handleApiEvent } from './api-handlers';
import { GenericApiData } from './types';

export const listen = (
  api: GearApi,
  genesis: string,
  callback: (arg: { key?: string; params: any; method: API_METHODS }) => void,
) => {
  return api.query.system.events(async (events) => {
    const blockHash = events.createdAtHash!.toHex();

    const [blockTimestamp, block, extrinsicStatus] = await Promise.all([
      api.blocks.getBlockTimestamp(blockHash!),
      api.blocks.get(blockHash),
      api.createType('ExtrinsicStatus', { finalized: blockHash }),
    ]);

    const base = {
      genesis,
      blockHash,
      timestamp: blockTimestamp.toNumber(),
    };

    for (const {
      event: { data, method },
    } of events) {
      try {
        const eventData = handleEvent(method as GEAR_EVENT, data as GenericEventData);
        eventData !== null &&
          callback({ key: eventData.key, params: { ...eventData.value, ...base }, method: API_METHODS.EVENTS });
      } catch (error) {
        eventListenerLogger.error({ method, data: data.toHuman() });
        eventListenerLogger.error(error);
      }
    }

    const data = {
      signedBlock: block,
      genesis,
      events,
      status: extrinsicStatus,
    };

    for (const {
      event: { method },
    } of events) {
      try {
        const updateData = handleApiEvent(method, data as GenericApiData);
        if (Array.isArray(updateData?.params)) {
          for (const data of updateData!.params) {
            callback({ params: { ...data }, method: updateData!.method });
          }
        } else {
          updateData && callback({ params: { ...updateData }, method: updateData.method });
        }
      } catch (error) {
        eventListenerLogger.error(error);
      }
    }
  });
};
