import { GearApi, Metadata } from '@gear-js/api';
import { AddressOrPair } from '@polkadot/api/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import { Account, AlertContainerFactory } from '@gear-js/react-hooks';

import { localPrograms } from './LocalDBService';
import ServerRPCRequestService from './ServerRPCRequestService';

import { RPC_METHODS, GEAR_BALANCE_TRANSFER_VALUE } from 'consts';
import { signPayload, isDevChain } from 'helpers';
import { ProgramStatus } from 'types/program';

export const uploadMetadata = async (
  programId: string,
  account: Account,
  name: string,
  injector: InjectedExtension,
  alert: AlertContainerFactory,
  metaFile?: any,
  meta?: Metadata,
  title?: string
) => {
  try {
    const jsonMeta = JSON.stringify(meta);

    if (isDevChain()) {
      await localPrograms.setItem(programId, {
        id: programId,
        name,
        title,
        meta: {
          meta: jsonMeta,
          metaFile,
          programId,
        },
        owner: account.decodedAddress,
        timestamp: Date(),
        initStatus: ProgramStatus.Success,
      });

      alert.success('Program added to the localDB successfully');

      return;
    }

    const apiRequest = new ServerRPCRequestService();

    await new Promise((resolve, reject) => {
      signPayload(injector, account.address, jsonMeta, (signature: string) => {
        apiRequest
          .callRPC(RPC_METHODS.ADD_METADATA, {
            name,
            meta: jsonMeta,
            title,
            metaFile,
            signature,
            programId,
          })
          .then(({ error }) => {
            if (error) {
              reject(new Error(error.message));
            }

            alert.success('Metadata saved successfully');
            resolve('success');
          })
          .catch(reject);
      });
    });
  } catch (error) {
    alert.error((error as Error).message);
  }
};

export const addMetadata = async (
  meta: Metadata,
  metaFile: any,
  account: Account,
  programId: string,
  name: any,
  alert: AlertContainerFactory
) => {
  const injector = await web3FromSource(account.meta.source);

  await uploadMetadata(programId, account, name, injector, alert, metaFile, meta, meta.title);
};

export const transferBalance = (
  api: GearApi,
  addressTo: string,
  addressFrom: AddressOrPair,
  alert: AlertContainerFactory
) => {
  api.balance.transfer(addressTo, GEAR_BALANCE_TRANSFER_VALUE);

  api.balance.signAndSend(addressFrom, ({ events }) => {
    events.forEach(({ event: { method, section } }) => {
      const eventTitle = `${section}.${method}`;

      if (method === 'Transfer') {
        alert.success('Balance received successfully', { title: eventTitle });

        return;
      }

      if (method === 'ExtrinsicFailed') {
        alert.error('Error when receiving balance', { title: eventTitle });
      }
    });
  });
};
