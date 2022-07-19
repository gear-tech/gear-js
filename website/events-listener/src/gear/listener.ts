import { GearApi } from '@gear-js/api';
import { GenericEventData } from '@polkadot/types';
import { API_METHODS, GEAR_EVENT } from '@gear-js/common';

import { eventListenerLogger } from '../common/event-listener.logger';
import { handleEvent } from './event-handlers';
import { handleBlockExtrinsics } from './block-extrinsics-handler';
import { UpdateBlockExtrinsics } from './types';
import { sleep } from '../utils';

export const listen = (api: GearApi, genesis: string,  callback: (arg: { key?: string; params: any; method: API_METHODS }) => void,) => {
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
        eventData && callback({
          key: eventData.key,
          params: { ...eventData.value, ...base },
          method: API_METHODS.EVENTS,
        });
      } catch (error) {
        eventListenerLogger.error({ method, data: data.toHuman() });
        eventListenerLogger.error(error);
      }
    }

    const updateBlockExtrinsics: UpdateBlockExtrinsics = {
      signedBlock: block,
      genesis,
      events,
      status: extrinsicStatus,
    };

    const { params } = handleBlockExtrinsics(updateBlockExtrinsics);
    await sleep(1000);
    callback({ params, method: API_METHODS.MESSAGE_UPDATE_DATA });
  });
};
