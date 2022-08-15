import { GearApi } from '@gear-js/api';
import { GenericEventData } from '@polkadot/types';
import { API_METHODS, Keys } from '@gear-js/common';

import { handleEvent } from './event-handlers';
import { handleBlockExtrinsics } from './block-extrinsics-handler';
import { UpdateBlockExtrinsics } from './types';
import { sleep } from '../utils';

export const listen = (
  api: GearApi,
  genesis: string,
  callback: (arg: { key?: string; params: any; method: API_METHODS }) => void,
) => {
  return api.query.system.events(async (events) => {
    const blockHash = events.createdAtHash!.toHex();

    const [blockTimestamp, block, extrinsicStatus] = await Promise.all([
      api.blocks.getBlockTimestamp(blockHash),
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
        const eventData = handleEvent(method as Keys, data as GenericEventData);
        eventData &&
          callback({
            key: eventData.key,
            params: { ...eventData.value, ...base },
            method: API_METHODS.EVENTS,
          });
      } catch (error) {
        console.error(error);
        console.log({ method, data: data.toHuman() });
        console.log('--------------ENDERROR--------------');
      }
    }

    const updateBlockExtrinsics: UpdateBlockExtrinsics = {
      signedBlock: block,
      genesis,
      events,
      status: extrinsicStatus,
    };

    const messageToUpdate = handleBlockExtrinsics(updateBlockExtrinsics);
    await sleep(1000);
    callback({ params: messageToUpdate, method: API_METHODS.MESSAGES_UPDATE_DATA });
  });
};
