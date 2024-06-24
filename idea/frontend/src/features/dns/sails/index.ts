import { Sails, TransactionBuilder } from 'sails-js';
import { HexString } from '@gear-js/api';
import { idl } from './idl';
import { DNS_CONTRACT_ADDRESS } from '@/shared/config';
import { useEffect } from 'react';
import { Account, useApi } from '@gear-js/react-hooks';
import { web3FromSource } from '@polkadot/extension-dapp';

const sails = await Sails.new();

sails.parseIdl(idl);
sails.setProgramId(DNS_CONTRACT_ADDRESS);

const signAndSendTransaction = async (account: Account, transaction: TransactionBuilder<unknown>) => {
  const { signer } = await web3FromSource(account.meta.source);
  transaction.withAccount(account.address, { signer });
  await transaction.calculateGas();
  return transaction.signAndSend();
};

const AddNewProgram = async (account: Account, name: string, program_id: HexString) => {
  const transaction = sails.services.Dns.functions.AddNewProgram(name, program_id);
  return signAndSendTransaction(account, transaction);
};

const ChangeProgramId = async (account: Account, name: string, program_id: HexString) => {
  const transaction = sails.services.Dns.functions.ChangeProgramId(name, program_id);
  return signAndSendTransaction(account, transaction);
};

const DeleteProgram = async (account: Account, name: string) => {
  const transaction = sails.services.Dns.functions.DeleteProgram(name);
  return signAndSendTransaction(account, transaction);
};

const useSetSailsApi = () => {
  const { isApiReady, api } = useApi();

  useEffect(() => {
    if (isApiReady && api) {
      sails.setApi(api);
    }
  }, [isApiReady, api]);
};

export { sails, AddNewProgram, ChangeProgramId, DeleteProgram, useSetSailsApi };
