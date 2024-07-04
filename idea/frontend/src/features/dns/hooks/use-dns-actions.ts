import { HexString } from '@gear-js/api';
import { useAccount } from '@gear-js/react-hooks';
import { web3FromSource } from '@polkadot/extension-dapp';
import { TransactionBuilder } from 'sails-js';

import { Method } from '@/features/explorer';
import { useLoading, useModal, useSignAndSend } from '@/hooks';
import { TransactionName } from '@/shared/config';

import { DNS_PROGRAM_QUERY_KEY, Program } from '../consts';
import { useQueryClient } from '@tanstack/react-query';

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
  const signAndSend = useSignAndSend();
  const queryClient = useQueryClient();
  const state = queryClient.getQueryState<Program>(DNS_PROGRAM_QUERY_KEY);
  const dnsProgram = state?.data;

  const sendMessage = async ({ getTransactionBuilder, options }: SendDnsMessage) => {
    if (!account || !dnsProgram) {
      return;
    }
    const { resolve: onSuccess, reject: onError } = options || {};
    const { signer } = await web3FromSource(account.meta.source);
    const transaction = getTransactionBuilder();
    transaction.withAccount(account.address, { signer });
    await transaction.calculateGas();

    const extrinsic = transaction.extrinsic;
    const { partialFee } = await extrinsic.paymentInfo(account.address, { signer });

    const handleConfirm = () => {
      enableLoading();
      signAndSend(extrinsic, Method.MessageQueued, {
        onSuccess,
        onError,
        onFinally: () => disableLoading(),
      });
    };

    showModal('transaction', {
      fee: partialFee.toHuman(),
      name: TransactionName.SendMessage,
      addressFrom: account.address,
      addressTo: dnsProgram.programId,
      onAbort: onError,
      onConfirm: handleConfirm,
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
