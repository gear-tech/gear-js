import { GearApi } from '@gear-js/api';
import { GenericEventData } from '@polkadot/types';
import { API_METHODS, GEAR_EVENT } from '@gear-js/common';

import { eventListenerLogger } from '../common/event-listener.logger';
import { handleEvent } from './event-handlers';
import { handleBlockExtrinsics } from './block-extrinsics-handler';
import { UpdateBlockExtrinsics } from './types';
import { kafkaProducer } from '../kafka/producer';

export const listen = (api: GearApi, genesis: string) => {
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
        eventData &&
          (await kafkaProducer.send({
            key: eventData.key,
            params: { ...eventData.value, ...base },
            method: API_METHODS.EVENTS,
          }));
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

    const { params } = await handleBlockExtrinsics(updateBlockExtrinsics);
    await kafkaProducer.send({ params, method: API_METHODS.MESSAGE_UPDATE_DATA });
  });
};
