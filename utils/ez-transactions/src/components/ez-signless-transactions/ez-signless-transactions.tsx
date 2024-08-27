import { SignlessTransactions } from '@/features/signless-transactions';
import { useEzTransactions } from '../../context';

type Props = {
  allowedActions: string[];
};

function EzSignlessTransactions({ allowedActions }: Props) {
  const { gasless, signless } = useEzTransactions();

  return (
    <SignlessTransactions
      allowedActions={allowedActions}
      onSessionCreate={signless.onSessionCreate}
      shouldIssueVoucher={!gasless.isEnabled}
      disabled={!signless.isSessionActive && gasless.isActive}
      requiredBalance={gasless.isEnabled ? 0 : undefined}
      boundSessionDuration={gasless.isEnabled ? gasless.voucherStatus?.duration : undefined}
    />
  );
}

export { EzSignlessTransactions };
