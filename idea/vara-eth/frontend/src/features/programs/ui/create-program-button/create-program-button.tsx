import type { Hex } from 'viem';

import { ActionButton } from '@/components';

import { useCreateProgram } from '../../lib';

type Props = {
  codeId: Hex;
};

const CreateProgramButton = ({ codeId }: Props) => {
  const createProgram = useCreateProgram();

  return (
    <ActionButton size="xs" onClick={() => createProgram.mutate(codeId)} isLoading={createProgram.isPending}>
      Create program
    </ActionButton>
  );
};

export { CreateProgramButton };
