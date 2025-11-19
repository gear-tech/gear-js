import { useMutation } from '@tanstack/react-query';
import { HexString } from 'gear-js-util';

import { TransactionTypes, unpackReceipt, useAddMyActivity } from '../store';

import { useWrappedVaraContract } from './use-wrapped-vara-contract';

const useApproveWrappedVara = (address: HexString) => {
  const { wrappedVaraContract } = useWrappedVaraContract();

  const addMyActivity = useAddMyActivity();

  const approveWrappedVara = async (value: bigint) => {
    if (!wrappedVaraContract) return;

    const tx = await wrappedVaraContract.approve(address, value);
    const result = await tx.send();
    const receipt = await tx.getReceipt();

    addMyActivity({
      type: TransactionTypes.approve,
      value: String(result.value),
      owner: result.from,
      spender: address,
      ...unpackReceipt(receipt),
    });

    return result;
  };

  const mutation = useMutation({ mutationFn: approveWrappedVara });

  return mutation;
};

export { useApproveWrappedVara };
