import { Metadata } from '@gear-js/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { InjectedExtension } from '@polkadot/extension-inject/types';
import { Account, AlertContainerFactory } from '@gear-js/react-hooks';

import { localPrograms } from './LocalDBService';
import ServerRPCRequestService from './ServerRPCRequestService';

import { RPC_METHODS } from 'consts';
import { isDevChain } from 'helpers';
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
  const { signature } = await injector.signer.signRaw!({
    address: account.address,
    data: jsonMeta,
    type: 'payload',
  });

  const { error } = await apiRequest.callRPC(RPC_METHODS.ADD_METADATA, {
    name,
    meta: jsonMeta,
    title,
    metaFile,
    signature,
    programId,
  });

  if (error) {
    throw new Error(error.message);
  }

  alert.success('Metadata saved successfully');
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
