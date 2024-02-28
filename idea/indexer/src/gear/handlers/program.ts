import { MessageQueued, generateCodeHash } from '@gear-js/api';
import { filterEvents } from '@polkadot/api/util';

import { HandlerParams, ProgramStatus, getExtrinsics } from '../../common';
import { Program } from '../../database';

export const handleProgramTxs = ({
  block,
  events,
  status,
  timestamp,
  blockHash,
  genesis,
  tempState,
}: HandlerParams) => {
  const extrinsics = getExtrinsics(block.block.extrinsics, ['uploadProgram', 'createProgram']);

  if (extrinsics.length === 0) {
    return;
  }

  extrinsics.map((tx) => {
    const mqEvent = filterEvents(tx.hash, block, events, status).events.find(
      ({ event }) => event.method === 'MessageQueued',
    );

    if (!mqEvent) {
      return null;
    }

    const {
      data: { source, destination },
    } = mqEvent.event as MessageQueued;

    const programId = destination.toHex();
    const owner = source.toHex();

    const codeId = tx.method.method === 'uploadProgram' ? generateCodeHash(tx.args[0].toHex()) : tx.args[0].toHex();

    return tempState.addProgram(
      new Program({
        id: programId,
        name: programId,
        owner,
        blockHash,
        timestamp,
        codeId,
        genesis,
        status: ProgramStatus.PROGRAM_SET,
      }),
    );
  });
};
