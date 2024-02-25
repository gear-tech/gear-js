import { CodeChanged } from '@gear-js/api';
import { filterEvents } from '@polkadot/api/util';
import { CodeStatus } from '@gear-js/common';

import { HandlerParams, getExtrinsics, getMetahash } from '../../common';
import { Code } from '../../database';

export const handleCodeTxs = async ({
  api,
  block,
  blockHash,
  events,
  status,
  timestamp,
  genesis,
  tempState,
}: HandlerParams) => {
  const extrinsics = getExtrinsics(block.block.extrinsics, ['uploadProgram', 'uploadCode']);

  if (extrinsics.length === 0) {
    return;
  }

  await Promise.all(
    extrinsics.map(async (tx) => {
      const event = filterEvents(tx.hash, block, events, status).events.find(
        ({ event: { method } }) => method === 'CodeChanged',
      );

      if (!event) {
        return;
      }

      const {
        data: { id, change },
      } = event.event as CodeChanged;
      const codeId = id.toHex();
      const metahash = await getMetahash(api.code, codeId);

      const codeStatus = change.isActive ? CodeStatus.ACTIVE : change.isInactive ? CodeStatus.INACTIVE : null;

      return tempState.addCode(
        new Code({
          id: codeId,
          name: codeId,
          genesis,
          status: codeStatus,
          timestamp,
          blockHash,
          expiration: change.isActive ? change.asActive.expiration.toString() : null,
          uploadedBy: tx.signer.inner.toHex(),
          metahash,
        }),
      );
    }),
  );
};
