import { randomBytes } from '@noble/hashes/utils';
import { type Address, type Hash, toHex } from 'viem';

import { ZERO_ADDRESS } from '../../util/constants.js';
import { IROUTER_ABI } from '../abi/IRouter.js';
import type { TxManager } from '../tx-manager.js';

type RouterTxManager = TxManager<object, object, typeof IROUTER_ABI>;

export const getProgramId = async (manager: RouterTxManager) => {
  const event = await manager.findEvent('ProgramCreated');
  return event.args.actorId.toLowerCase();
};

export const waitForCodeGotValidated = (codeId: Hash) => (manager: RouterTxManager) => async () => {
  const { blockNumber } = await manager.getReceipt();
  let unwatch: (() => void) | undefined;

  try {
    return await new Promise<boolean>((resolve, reject) => {
      unwatch = manager.pc.watchContractEvent({
        address: manager.contractAddress,
        abi: IROUTER_ABI,
        eventName: 'CodeGotValidated',
        fromBlock: blockNumber,
        onLogs: (logs_1) => {
          for (const log of logs_1) {
            if (log.args.codeId === codeId) {
              if (log.args.valid) {
                resolve(true);
              } else {
                reject(new Error('Code validation failed'));
              }
            }
          }
        },
      });
    });
  } finally {
    unwatch?.();
  }
};

export const getSalt = (salt?: Hash) => salt ?? toHex(randomBytes(32));

export const getOverrideInitializer = (overrideInitializer?: Address) => overrideInitializer ?? ZERO_ADDRESS;
