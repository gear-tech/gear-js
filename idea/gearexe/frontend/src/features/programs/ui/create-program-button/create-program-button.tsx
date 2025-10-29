import { Button } from '@/components';

import { useCreateProgram } from '../../lib';

type Props = {
  codeId: string;
};

const CreateProgramButton = ({ codeId }: Props) => {
  const createProgram = useCreateProgram();
  return (
    <Button size="xs" onClick={() => createProgram.mutate(codeId)} isLoading={createProgram.isPending}>
      Create program
    </Button>
  );
};

export { CreateProgramButton };
