import { HexString } from '@gear-js/api';
import { useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import { web3FromSource } from '@polkadot/extension-dapp';
import { TransactionBuilder } from 'sails-js';

import { useLoading, useModal } from '@/hooks';
import { TransactionName } from '@/shared/config';

import { Program } from '../consts';
import { useQueryClient } from '@tanstack/react-query';

const DNS_PROGRAM_QUERY_KEY = ['dnsProgram'];

type ResolveRejectOptions = {
  resolve?: () => void;
  reject?: () => void;
};

type SendDnsMessage = {
  getTransactionBuilder: () => TransactionBuilder<null>;
  options?: ResolveRejectOptions;
};

const useDnsActions = () => {
  const [isLoading, enableLoading, disableLoading] = useLoading();
  const { showModal } = useModal();
  const { account } = useAccount();
  const alert = useAlert();
  const { api } = useApi();
  const queryClient = useQueryClient();
  const state = queryClient.getQueryState<Program>(DNS_PROGRAM_QUERY_KEY);
  const dnsProgram = state?.data;

  const sendMessage = async ({ getTransactionBuilder, options }: SendDnsMessage) => {
    if (!account || !api || !dnsProgram) {
      return;
    }
    const { resolve: onSuccess, reject: onError } = options || {};
    const { signer } = await web3FromSource(account.meta.source);
    // ! TODO: calculate fee by sails
    // const { partialFee } = await api.message.paymentInfo(account.address, { signer });

    return new Promise<void>((resolve, reject) => {
      const onConfirm = async () => {
        if (account) {
          try {
            enableLoading();
            const transaction = getTransactionBuilder();

            transaction.withAccount(account.address, { signer });

            await transaction.calculateGas();
            const result = await transaction.signAndSend();
            await result.response().then(() => {
              if (onSuccess) onSuccess();
            });
            return resolve();
          } catch (error) {
            const errorMessage = (error as Error).message;
            alert.error(errorMessage);
            if (onError) onError();
            return reject();
          } finally {
            disableLoading();
          }
        }
      };

      showModal('transaction', {
        fee: '0',
        name: TransactionName.SendMessage,
        addressFrom: account.address,
        addressTo: dnsProgram.programId,
        onAbort: reject,
        onConfirm,
      });
    });
  };

  const addNewProgram = (name: string, program_id: HexString, options?: ResolveRejectOptions) => {
    if (!dnsProgram) throw new Error('dnsProgram is not initialized');
    const getTransactionBuilder = () => dnsProgram.dns.addNewProgram(name, program_id);
    return sendMessage({ getTransactionBuilder, options });
  };

  const changeProgramId = (name: string, program_id: HexString, options?: ResolveRejectOptions) => {
    if (!dnsProgram) throw new Error('dnsProgram is not initialized');
    const getTransactionBuilder = () => dnsProgram.dns.changeProgramId(name, program_id);
    return sendMessage({ getTransactionBuilder, options });
  };

  const deleteProgram = (name: string, options?: ResolveRejectOptions) => {
    if (!dnsProgram) throw new Error('dnsProgram is not initialized');
    const getTransactionBuilder = () => dnsProgram.dns.deleteProgram(name);
    return sendMessage({ getTransactionBuilder, options });
  };

  return { isLoading, addNewProgram, changeProgramId, deleteProgram };
};

export { useDnsActions };
