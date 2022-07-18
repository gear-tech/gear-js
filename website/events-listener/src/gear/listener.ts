import { GearApi } from '@gear-js/api';
import { GenericEventData } from '@polkadot/types';
import { API_METHODS, GEAR_EVENT } from '@gear-js/common';

import { eventListenerLogger } from '../common/event-listener.logger';
import { handleEvent } from './event-handlers';
import { handleApiEvent } from './api-handlers';
import { GenericApiData, HandleGearSystemEventParams, UpdateGearApiEventParams } from './types';

export const listen = (
  api: GearApi,
  genesis: string,
  callback: (arg: { key?: string; params: any; method?: API_METHODS }) => void,
) => {
  return api.query.system.events(async (events) => {
    const blockHash = events.createdAtHash!.toHex();

    const [blockTimestamp, block, extrinsicStatus] = await Promise.all([
      api.blocks.getBlockTimestamp(blockHash!),
      api.blocks.get(blockHash),
      api.createType('ExtrinsicStatus', { finalized: blockHash }),
    ]);

    // const base = {
    //   genesis,
    //   blockHash,
    //   timestamp: blockTimestamp.toNumber(),
    // };

    await handleGearApiEvent(
      {
        genesis,
        blockHash,
        timestamp: blockTimestamp.toNumber(),
        events,
      },
      callback,
    );

    // for (const {
    //   event: { data, method },
    // } of events) {
    //   try {
    //     const eventData = handleEvent(method as GEAR_EVENT, data as GenericEventData);
    //     eventData !== null && callback({ key: eventData.key, params: { ...eventData.value, ...base } });
    //   } catch (error) {
    //     eventListenerLogger.error({ method, data: data.toHuman() });
    //     eventListenerLogger.error(error);
    //   }
    // }

    // const data = {
    //   signedBlock: block,
    //   genesis,
    //   events,
    //   status: extrinsicStatus,
    // };

    await updateGearApiEvent(
      {
        signedBlock: block,
        genesis,
        events,
        status: extrinsicStatus,
      },
      callback,
    );

    // for (const {
    //   event: { method },
    // } of events) {
    //   try {
    //     const updateData = handleApiEvent(method, data as GenericApiData);
    //     if (Array.isArray(updateData?.params)) {
    //       for (const data of updateData!.params) {
    //         callback({ params: { ...data }, method: updateData!.method });
    //       }
    //     } else {
    //       updateData && callback({ params: { ...updateData }, method: updateData.method });
    //     }
    //   } catch (error) {
    //     eventListenerLogger.error(error);
    //   }
    // }
  });
};

async function handleGearApiEvent(params: HandleGearSystemEventParams, callback: any): Promise<void> {
  const { events, genesis, blockHash, timestamp } = params;

  const base = {
    genesis,
    blockHash,
    timestamp,
  };

  for (const {
    event: { data, method },
  } of events) {
    try {
      const eventData = handleEvent(method as GEAR_EVENT, data as GenericEventData);
      eventData !== null && callback({ key: eventData.key, params: { ...eventData.value, ...base } });
    } catch (error) {
      eventListenerLogger.error({ method, data: data.toHuman() });
      eventListenerLogger.error(error);
    }
  }
}

async function updateGearApiEvent(params: UpdateGearApiEventParams, callback: any): Promise<void> {
  const { events, status, genesis, signedBlock } = params;

  const data = {
    signedBlock,
    genesis,
    events,
    status,
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
}
