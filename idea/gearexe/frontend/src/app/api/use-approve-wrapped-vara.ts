import { useMutation } from '@tanstack/react-query';
import { HexString } from 'gearexe';

import { TransactionTypes, unpackReceipt, useAddMyActivity } from '../store';

import { useWrappedVaraContract } from './use-wrapped-vara-contract';

const useApproveWrappedVara = (address: HexString) => {
  const { wrappedVaraContract } = useWrappedVaraContract();

  const addMyActivity = useAddMyActivity();

  const approveWrappedVara = async (value: bigint) => {
    if (!wrappedVaraContract) return;

    const result = await wrappedVaraContract.approve(address, value);

    addMyActivity({
      type: TransactionTypes.approve,
      ...result,
      value: String(result.value),
      ...unpackReceipt(),
    });

    return result;
  };

  const mutation = useMutation({ mutationFn: approveWrappedVara });

  return mutation;
};

export { useApproveWrappedVara };
