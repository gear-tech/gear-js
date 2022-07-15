import { GearApi } from '@gear-js/api';
import { GenericEventData } from '@polkadot/types';
import { GEAR_EVENT } from '@gear-js/common';

import { eventListenerLogger } from '../common/event-listener.logger';
import { handleEvent } from './event-handlers';
import { gearService } from '../services/gear.service';

export const listen = (api: GearApi, genesis: string, callback: (arg: { key: string; value: any }) => void) => {
  return api.query.system.events(async (events) => {
    const blockHash = events.createdAtHash!.toHex();

    const [signerBlockTimestamp, signedBlock, extrinsicStatus] = await Promise.all([
      api.blocks.getBlockTimestamp(blockHash!),
      api.blocks.get(blockHash),
      api.createType('ExtrinsicStatus', { finalized: blockHash }),
    ]);

    const base = {
      genesis,
      blockHash,
      timestamp: signerBlockTimestamp.toNumber(),
    };

    for (const {
      event: { data, method },
    } of events) {
      try {
        const eventData = handleEvent(method as GEAR_EVENT, data as GenericEventData);
        eventData !== null && callback({ key: eventData.key, value: { ...eventData.value, ...base } });
      } catch (error) {
        eventListenerLogger.error({ method, data: data.toHuman() });
        eventListenerLogger.error(error);
      }
    }

    await gearService.updateMessagePayload<typeof extrinsicStatus>(signedBlock, events, extrinsicStatus);
  });
};
