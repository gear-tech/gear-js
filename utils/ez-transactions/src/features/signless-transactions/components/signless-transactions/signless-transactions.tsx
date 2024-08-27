import { Button } from '@gear-js/vara-ui';
import { useAccount, useBalanceFormat, withoutCommas } from '@gear-js/react-hooks';
import { decodeAddress } from '@gear-js/api';
import { useState } from 'react';
import clsx from 'clsx';

import { useCountdown } from '../../hooks';
import { ReactComponent as SignlessSVG } from '@/assets/icons/signless.svg';
import { ReactComponent as PowerSVG } from '@/assets/icons/power.svg';
import { useSignlessTransactions } from '../../context';
import { getDHMS } from '../../utils';
import { CreateSessionModal } from '../create-session-modal';
import { EnableSessionModal } from '../enable-session-modal';
import styles from './signless-transactions.module.css';
import { SignlessParams } from '../signless-params-list';
import { AccountPair } from '../account-pair';
import { EnableSignlessSession } from '../enable-signless-session';

type Props = {
  allowedActions: string[];
  onSessionCreate?: (signlessAccountAddress: string) => Promise<`0x${string}`>;
  shouldIssueVoucher?: boolean;
  disabled?: boolean;
  requiredBalance?: number;
  boundSessionDuration?: number;
};

function SignlessTransactions({
  allowedActions,
  onSessionCreate,
  shouldIssueVoucher,
  disabled,
  requiredBalance,
  boundSessionDuration,
}: Props) {
  const { account } = useAccount();
  const { pair, session, isSessionReady, voucherBalance, storagePair, deletePair, deleteSession } =
    useSignlessTransactions();
  const [modal, setModal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const openCreateModal = () => setModal('create');
  const openEnableModal = () => setModal('enable');
  const closeModal = () => setModal('');
  const expireTimestamp = +withoutCommas(session?.expires || '0');
  const countdown = useCountdown(expireTimestamp);

  const { getFormattedBalance } = useBalanceFormat();
  const sessionBalance = voucherBalance ? getFormattedBalance(voucherBalance) : undefined;

  const onDeleteSessionSuccess = () => {
    deletePair();
  };

  const onDeleteSessionFinally = () => {
    setIsLoading(false);
  };

  const handleProlongExpiredSession = () => {
    if (pair) {
      openCreateModal();
    }
  };

  const handleRevokeVoucherFromStoragePair = async () => {
    if (!pair) throw new Error('Signless pair not found');

    const decodedAddress = decodeAddress(pair.address);

    setIsLoading(true);

    deleteSession(decodedAddress, pair, {
      onSuccess: onDeleteSessionSuccess,
      onFinally: onDeleteSessionFinally,
    });
  };

  return account && isSessionReady ? (
    <div className={styles.container}>
      {session && (
        <>
          <div className={styles.buttons}>
            {storagePair ? (
              !pair && (
                <button className={styles.enableButton} onClick={openEnableModal}>
                  <div className={styles.itemIcon}>
                    <SignlessSVG />
                  </div>
                  <span className={styles.itemText}>Unlock signless transactions</span>
                </button>
              )
            ) : (
              <p>Signless account not found in the storage.</p>
            )}
          </div>

          <div className={styles.sessionContainer}>
            <div className={styles.titleWrapper}>
              <SignlessSVG />
              <h3 className={styles.title}>Signless Session is active</h3>
            </div>

            <SignlessParams
              params={[
                {
                  heading: storagePair ? 'Account from the storage:' : 'Randomly generated account:',
                  value: pair ? <AccountPair pair={pair} /> : <span>Inactive</span>,
                },
                {
                  heading: 'Remaining balance:',
                  value: sessionBalance ? `${sessionBalance.value} ${sessionBalance.unit}` : '-',
                },
                {
                  heading: 'Approved Actions:',
                  value: session.allowedActions.join(', '),
                },
                {
                  heading: 'Expires:',
                  value: countdown ? getDHMS(countdown) : '-- : -- : --',
                },
              ]}
            />

            <EnableSignlessSession
              type="button"
              allowedActions={allowedActions}
              onSessionCreate={onSessionCreate}
              shouldIssueVoucher={shouldIssueVoucher}
              requiredBalance={requiredBalance}
              boundSessionDuration={boundSessionDuration}
            />
          </div>
        </>
      )}

      {!session && storagePair && (
        <>
          <div className={clsx(styles.titleWrapper, styles.expiredTitleWrapper)}>
            <h3 className={styles.title}>Your Signless Session is expired</h3>
          </div>

          {pair && (
            <div className={styles.expiredButtons}>
              <Button
                icon={SignlessSVG}
                text="Prolong session"
                isLoading={isLoading}
                size="small"
                onClick={handleProlongExpiredSession}
              />

              <Button
                icon={PowerSVG}
                text="Disable session"
                color="light"
                className={styles.closeButton}
                isLoading={isLoading}
                size="small"
                onClick={handleRevokeVoucherFromStoragePair}
              />
            </div>
          )}
        </>
      )}

      {!session && (
        <EnableSignlessSession
          type="button"
          allowedActions={allowedActions}
          onSessionCreate={onSessionCreate}
          shouldIssueVoucher={shouldIssueVoucher}
          disabled={disabled}
          requiredBalance={requiredBalance}
          boundSessionDuration={boundSessionDuration}
        />
      )}

      {modal === 'enable' && <EnableSessionModal close={closeModal} />}
      {modal === 'create' && (
        <CreateSessionModal
          allowedActions={allowedActions}
          close={closeModal}
          onSessionCreate={onSessionCreate}
          shouldIssueVoucher={shouldIssueVoucher}
          boundSessionDuration={boundSessionDuration}
        />
      )}
    </div>
  ) : null;
}

export { SignlessTransactions };
