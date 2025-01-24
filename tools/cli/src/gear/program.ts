import { GearApi, MessageQueued, ProgramMetadata } from '@gear-js/api';
import { KeyringPair } from '@polkadot/keyring/types';
import { u8aToHex } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';
import fs from 'fs';
import path from 'path';

import { IProgram, SchemeProgram } from '../types/index';
import { isProgramInitialized } from './findEvents';
import { logger } from '../utils/index';

export async function uploadProgram(
  api: GearApi,
  account: KeyringPair,
  wasm: Buffer,
  meta: ProgramMetadata,
  initPayload: any,
  value?: number | string,
) {
  const gas = await api.program.calculateGas.initUpload(
    u8aToHex(account.addressRaw),
    wasm,
    initPayload,
    value,
    false,
    meta,
    meta?.types.init.input,
  );

  logger.info(`Calculated gas: ${gas.min_limit.toHuman()}`, { lvl: 1 });

  const { programId, extrinsic } = api.program.upload(
    { code: wasm, value, gasLimit: gas.min_limit, initPayload },
    meta,
    meta?.types.init.input,
  );

  logger.info(`Program id: ${programId}`, { lvl: 1 });

  const [blockHash, _msgId]: [HexString, HexString] = await new Promise((resolve) =>
    extrinsic.signAndSend(account, ({ events, status }) => {
      const meEvent = events.find(({ event: { method } }) => method === 'MessageQueued');
      if (meEvent) {
        if (status.isInBlock) {
          resolve([status.asInBlock.toHex(), (meEvent.event as MessageQueued).data.id.toHex()]);
        }
      }
    }),
  );

  logger.info(`Program added to block ${blockHash}`, { lvl: 1 });
  const isSuccess = await isProgramInitialized(api, programId, blockHash);

  if (isSuccess) {
    logger.info('Program initialized successfuly', { lvl: 1 });
    return programId;
  }

  throw new Error('Program initialization failed');
}

export function getPrograms(programs: Array<SchemeProgram>, basePath: string): Record<number, IProgram> {
  const result: Record<number, IProgram> = {};

  programs.forEach(({ id, path_to_meta, path_to_wasm, ...rest }) => {
    const meta = path_to_meta
      ? ProgramMetadata.from(`0x${fs.readFileSync(path.resolve(basePath, path_to_meta), 'utf-8')}`)
      : undefined;
    const wasm = path_to_wasm ? fs.readFileSync(path.resolve(basePath, path_to_wasm)) : undefined;
    result[id] = {
      ...rest,
      meta,
      wasm,
    };
  });

  return result;
}
