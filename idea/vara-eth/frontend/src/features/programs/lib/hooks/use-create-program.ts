import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generatePath, useNavigate } from 'react-router-dom';
import type { Address, Hex } from 'viem';
import { isAddress } from 'viem';

import { useApi } from '@/app/api';
import { TransactionTypes, unpackReceipt, useAddMyActivity } from '@/app/store';
import { routes } from '@/shared/config';

export type CreateProgramParams = {
  codeId: Hex;
  useExecutableBalance: boolean;
  executableBalanceWei?: bigint;
  abiInterface?: Address;
  overrideInitializer?: Address;
};

export const useCreateProgram = () => {
  const { data: api } = useApi();
  const navigate = useNavigate();
  const addMyActivity = useAddMyActivity();
  const queryClient = useQueryClient();

  const createProgram = async (params: CreateProgramParams) => {
    if (!api) {
      throw new Error('API is not initialized');
    }

    const { codeId, useExecutableBalance, executableBalanceWei, abiInterface, overrideInitializer } = params;

    if (abiInterface !== undefined && !isAddress(abiInterface)) {
      throw new Error('Invalid ABI interface address');
    }

    if (overrideInitializer !== undefined && !isAddress(overrideInitializer)) {
      throw new Error('Invalid override initializer address');
    }

    try {
      const builder = api.eth.router.createProgramBuilder(codeId);

      if (useExecutableBalance) {
        if (executableBalanceWei === undefined || executableBalanceWei <= 0n) {
          throw new Error('Executable balance amount is required');
        }

        const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
        const { signature } = await api.eth.wvara.prepareAndSignPermitData(
          api.eth.router.address,
          executableBalanceWei,
          deadline,
        );

        builder.withExecutableBalance(executableBalanceWei, deadline, signature);
      }

      if (abiInterface) {
        builder.withAbiInterface(abiInterface);
      }

      if (overrideInitializer) {
        builder.withOverrideInitializer(overrideInitializer);
      }

      const tx = builder.build();
      await tx.estimateGas();
      await tx.send();
      const id = await tx.getProgramId();
      const receipt = await tx.getReceipt();

      await addMyActivity({
        type: TransactionTypes.createProgram,
        codeId,
        programId: id,
        ...unpackReceipt(receipt),
      });

      void navigate(generatePath(routes.program, { programId: id }));
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);

      await addMyActivity({
        type: TransactionTypes.createProgram,
        codeId,
        resultStatus: 'error',
        error: message,
      });

      throw cause;
    }
  };

  const mutation = useMutation({
    mutationFn: createProgram,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['allPrograms'] }),
  });

  return mutation;
};
