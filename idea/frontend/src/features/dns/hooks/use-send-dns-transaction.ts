import {
  useAccount,
  useAlert,
  useApi,
  useBalanceFormat,
  usePrepareProgramTransaction,
  useProgram,
} from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';

import { Method } from '@/features/explorer';
import { useLoading, useModal, useSignAndSend } from '@/hooks';
import { TransactionName } from '@/shared/config';
import { getErrorMessage } from '@/shared/helpers';

import { FUNCTION_NAME, Program } from '../consts';
import { getDnsProgramId } from '../utils';

const SERVICE_NAME = 'dns' as const;

type FunctionName = typeof FUNCTION_NAME[keyof typeof FUNCTION_NAME];

const useSendDnsTransaction = <T extends FunctionName>(functionName: T) => {
  const { api, isApiReady } = useApi();

  const { account } = useAccount();
  const { getFormattedBalance } = useBalanceFormat();
  const alert = useAlert();

  const [isLoading, enableLoading, disableLoading] = useLoading();
  const { showModal } = useModal();
  const signAndSend = useSignAndSend();

  const getQuery = () => {
    if (!isApiReady) throw new Error('API is not initialized');
    const genesis = api.genesisHash.toHex();

    return getDnsProgramId({ genesis });
  };

  const { data: id } = useQuery({ queryKey: ['dnsProgramId'], queryFn: getQuery, enabled: isApiReady });
  const { data: program } = useProgram({ library: Program, id });

  const { prepareTransactionAsync } = usePrepareProgramTransaction({
    program,
    serviceName: SERVICE_NAME,
    functionName: functionName,
  });

  const sendTransaction = async (
    args: Parameters<typeof prepareTransactionAsync>[0]['args'],
    onSuccess: () => void,
  ) => {
    if (!id) throw new Error('DNS program ID is not found');
    if (!account) throw new Error('Account is not found');

    enableLoading();

    const onFinally = disableLoading;

    try {
      const { transaction, awaited } = await prepareTransactionAsync({ args });
      const formattedFee = getFormattedBalance(awaited.fee.toString());

      showModal('transaction', {
        fee: `${formattedFee.value} ${formattedFee.unit}`,
        name: TransactionName.SendMessage,
        addressFrom: account.address,
        addressTo: id,
        onAbort: onFinally,
        onConfirm: () => signAndSend(transaction.extrinsic, Method.MessageQueued, { onSuccess, onFinally }),
      });
    } catch (error) {
      alert.error(getErrorMessage(error));
      onFinally();
    }
  };

  return { isLoading: isLoading || !id, sendTransaction };
};

export { useSendDnsTransaction };
