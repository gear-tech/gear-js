import { TransactionBuilder } from 'sails-js';
import { HexString } from '@gear-js/api';
import { ActorId, Program } from './lib';

import { useEffect, useState } from 'react';
import { Account, useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import { web3FromSource } from '@polkadot/extension-dapp';
import { DNS_API_URL, TransactionName } from '@/shared/config';
import { useLoading } from '../hooks';
import { useModal } from '@/hooks';

let dnsProgram: Program;

type ResolveRejectOptions = {
  resolve?: () => void;
  reject?: () => void;
};

type SendDnsMessage = {
  getTransactionBuilder: () => Promise<TransactionBuilder<null>>;
  options?: ResolveRejectOptions;
};

const useDnsActions = () => {
  const [isLoading, enableLoading, disableLoading] = useLoading();
  const { showModal } = useModal();
  const { account } = useAccount();
  const alert = useAlert();
  const { api } = useApi();

  const sendMessage = async ({ getTransactionBuilder, options }: SendDnsMessage) => {
    if (!account || !api) {
      return;
    }
    const { resolve, reject } = options || {};
    const { signer } = await web3FromSource(account.meta.source);
    // ! TODO: calculate fee by sails
    // const { partialFee } = await api.message.paymentInfo(account.address, { signer });

    const onConfirm = async () => {
      if (account) {
        try {
          enableLoading();
          const transaction = await getTransactionBuilder();

          transaction.withAccount(account.address, { signer });

          await transaction.calculateGas();
          const result = await transaction.signAndSend();
          await result.response().then(() => {
            if (resolve) resolve();
          });
        } catch (error) {
          const errorMessage = (error as Error).message;
          alert.error(errorMessage);
          if (reject) reject();
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
  };

  const addNewProgram = (name: string, program_id: HexString, options?: ResolveRejectOptions) => {
    const getTransactionBuilder = async () => dnsProgram.dns.addNewProgram(name, program_id as unknown as ActorId);
    return sendMessage({ getTransactionBuilder, options });
  };

  const changeProgramId = (name: string, program_id: HexString, options?: ResolveRejectOptions) => {
    const getTransactionBuilder = async () => dnsProgram.dns.changeProgramId(name, program_id as unknown as ActorId);
    return sendMessage({ getTransactionBuilder, options });
  };

  const deleteProgram = (name: string, options?: ResolveRejectOptions) => {
    const getTransactionBuilder = async () => dnsProgram.dns.deleteProgram(name);
    return sendMessage({ getTransactionBuilder, options });
  };

  return { isLoading, addNewProgram, changeProgramId, deleteProgram };
};

const useInitDnsProgram = () => {
  const { isApiReady, api } = useApi();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!dnsProgram && !isLoading && isApiReady && api) {
      setIsLoading(true);

      fetch(`${DNS_API_URL}/dns/contract`).then((response) => {
        response.json().then(({ contract }) => {
          const programId = contract;
          dnsProgram = new Program(api, programId);
          setIsLoading(false);
        });
      });
    }
  }, [isApiReady, api]);
};

export { useInitDnsProgram, Program, useDnsActions };
