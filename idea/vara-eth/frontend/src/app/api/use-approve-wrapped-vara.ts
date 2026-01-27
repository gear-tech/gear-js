import { useMutation } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';

import { TransactionTypes, unpackReceipt, useAddMyActivity } from '../store';

import { useEthereumClient } from './use-ethereum-client';

const useApproveWrappedVara = (address: HexString) => {
  const { data: ethereumClient } = useEthereumClient();

  const addMyActivity = useAddMyActivity();

  const approveWrappedVara = async (value: bigint) => {
    if (!ethereumClient) return;

    const tx = await ethereumClient.wvara.approve(address, value);
    const result = await tx.send();
    const receipt = await tx.getReceipt();

    await addMyActivity({
      type: TransactionTypes.approve,
      value: value.toString(),
      owner: receipt.from,
      spender: address,
      ...unpackReceipt(receipt),
    });

    return result;
  };

  const mutation = useMutation({ mutationFn: approveWrappedVara });

  return mutation;
};

export { useApproveWrappedVara };
