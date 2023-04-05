import { CreateType, GearApi, MessageQueued, ProgramMetadata } from '@gear-js/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { u64 } from '@polkadot/types';
import { u8aToHex } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';

import { logger } from '../utils';
import { getReply, isMsgDispatchedSuccessfully } from './findEvents';

export async function sendMessage(
  api: GearApi,
  account: KeyringPair,
  programId: HexString,
  meta: ProgramMetadata,
  payload: any,
  value?: number | string,
  increaseGas?: number,
) {
  const calculatedGas = await api.program.calculateGas.handle(
    u8aToHex(account.addressRaw),
    programId,
    payload,
    value,
    false,
    meta,
    meta?.types.handle.input,
  );

  let gas = calculatedGas.min_limit;

  if (increaseGas) {
    gas = CreateType.create('u64', gas.add(gas.muln(increaseGas))) as u64;
  }

  logger.info(`Calculated gas: ${calculatedGas.min_limit.toHuman()}. Applied gas: ${gas.toHuman()}`, { lvl: 1 });

  const extrinsic = api.message.send(
    { destination: programId, value, gasLimit: gas, payload },
    meta,
    meta?.types.handle.input,
  );

  const [blockHash, msgId]: [HexString, HexString] = await new Promise((resolve) =>
    extrinsic.signAndSend(account, ({ events, status }) => {
      const meEvent = events.find(({ event: { method } }) => method === 'MessageQueued');
      if (meEvent) {
        if (status.isInBlock) {
          resolve([status.asInBlock.toHex(), (meEvent.event as MessageQueued).data.id.toHex()]);
        }
      }
    }),
  );

  logger.info(`Message id: ${msgId}`, { lvl: 1 });

  const isSuccess = await isMsgDispatchedSuccessfully(api, msgId, blockHash);

  if (!isSuccess) {
    throw new Error('Message failed');
  }
  logger.info('Message dispatched successfuly', { lvl: 1 });

  const reply = await getReply(api, programId, msgId, blockHash, 10);

  if (!reply) {
    throw new Error('Reply was not received');
  }
  logger.info(`Reply message id: ${reply.msgId}`, { lvl: 1 });
  logger.info(
    `Reply payload ${
      meta
        ? JSON.stringify(meta.createType(meta.types.handle.output!, reply.payload).toJSON())
        : reply.payload.toHuman()
    }`,
    { lvl: 1 },
  );
}
