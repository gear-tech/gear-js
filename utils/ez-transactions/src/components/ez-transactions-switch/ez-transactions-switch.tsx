import { EnableSignlessSession } from '@/features/signless-transactions';
import { EnableGaslessSession } from '@/features/gasless-transactions';

import { useEzTransactions } from '../../context';
import styles from './ez-transactions-switch.module.css';

type Props = {
  allowedActions: string[];
};

function EzTransactionsSwitch({ allowedActions }: Props) {
  const { gasless, signless } = useEzTransactions();

  return (
    <div className={styles.container}>
      <EnableGaslessSession
        type="switcher"
        disabled={signless.isSessionActive}
        message={signless.isSessionActive ? 'Signless Session is Active' : ''}
      />

      <EnableSignlessSession
        type="switcher"
        allowedActions={allowedActions}
        onSessionCreate={signless.onSessionCreate}
        shouldIssueVoucher={!gasless.isEnabled}
        disabled={!signless.isSessionActive && gasless.isActive}
        message={!signless.isSessionActive && gasless.isActive ? 'Gasless Session is Active' : ''}
        requiredBalance={gasless.isEnabled ? 0 : undefined}
        boundSessionDuration={gasless.isEnabled ? gasless.voucherStatus?.duration : undefined}
      />
    </div>
  );
}

export { EzTransactionsSwitch };
