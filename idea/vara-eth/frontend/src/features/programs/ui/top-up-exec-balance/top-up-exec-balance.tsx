import { HexString } from '@vara-eth/api';
import { parseUnits } from 'viem';

import { useApproveWrappedVara } from '@/app/api';
import { Button } from '@/components';

import { useExecutableBalanceTopUp } from '../../lib';

type Props = {
  programId: HexString;
  onSuccess: () => void;
};

const TopUpExecBalance = ({ programId, onSuccess }: Props) => {
  const approveWrappedVara = useApproveWrappedVara(programId);
  const executableBalanceTopUp = useExecutableBalanceTopUp(programId);

  const handleTopUpClick = async () => {
    const value = parseUnits('1', 12);

    await approveWrappedVara.mutateAsync(value);
    await executableBalanceTopUp.mutateAsync(value);

    onSuccess();
  };

  return (
    <Button
      size="xs"
      onClick={handleTopUpClick}
      isLoading={executableBalanceTopUp.isPending || approveWrappedVara.isPending}
      variant="secondary">
      Top up
    </Button>
  );
};

export { TopUpExecBalance };
