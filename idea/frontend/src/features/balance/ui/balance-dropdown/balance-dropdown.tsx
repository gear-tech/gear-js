import { useAccount, useDeriveBalancesAll, useDeriveStakingAccount } from '@gear-js/react-hooks';
import { Balance as BalanceType } from '@polkadot/types/interfaces';
import { useMemo } from 'react';
import { CSSTransition } from 'react-transition-group';

import { useModalState } from '@/hooks';
import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';
import { AnimationTimeout } from '@/shared/config';

import VaraSVG from '../../assets/vara.svg?react';
import { Balance } from '../balance';
import { TransferBalance } from '../transfer-balance';
import { GetTestBalance } from '../get-test-balance';
import styles from './balance-dropdown.module.scss';

function BalanceContainer({ heading, value }: { heading: string; value: BalanceType | string | bigint }) {
  return (
    <span className={styles.balance}>
      <span className={styles.heading}>{heading}:</span>
      <Balance value={value} />
    </span>
  );
}

const BalanceDropdown = () => {
  const { account } = useAccount();
  const { data: balance } = useDeriveBalancesAll({ address: account?.address });
  const { data: stakingAccount } = useDeriveStakingAccount({ address: account?.address });
  const [isOpen, open, close] = useModalState();

  const getUnbondingBalance = () => {
    if (!stakingAccount?.unlocking) return 0n;

    return stakingAccount.unlocking.reduce((acc, unlock) => {
      const remainingEras = BigInt(unlock.remainingEras.toString());
      const value = unlock.value.toBigInt();

      return remainingEras > 0 && value > 0 ? acc + value : acc;
    }, 0n);
  };

  const stakingBalance = useMemo(() => {
    if (!stakingAccount) return;

    const bonded = stakingAccount.stakingLedger.active.unwrap().toBigInt();
    const redeemable = stakingAccount.redeemable?.toBigInt() || 0n;
    const unbonding = getUnbondingBalance();

    return { bonded, redeemable, unbonding };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingAccount]);

  if (!balance || !stakingBalance) return null;

  // availableBalance should be changed to transferableBalance after @polkadot/api 12.4 update
  const { freeBalance, reservedBalance, availableBalance: transferable, lockedBalance } = balance;
  const { bonded, redeemable, unbonding } = stakingBalance;

  return (
    <div className={styles.container}>
      <button type="button" className={styles.button} onClick={isOpen ? close : open}>
        <VaraSVG />

        <span className={styles.balance}>
          <span className={styles.heading}>Transferable Balance:</span>

          <span>
            <Balance value={transferable} hideUnit />
            <ArrowSVG className={styles.arrow} />
          </span>
        </span>
      </button>

      <CSSTransition in={isOpen} timeout={AnimationTimeout.Default} mountOnEnter unmountOnExit>
        <div className={styles.dropdown}>
          <button type="button" className={styles.header} onClick={close}>
            <VaraSVG />
            <BalanceContainer heading="Total Balance" value={freeBalance.add(reservedBalance).toString()} />
          </button>

          <div className={styles.body}>
            <BalanceContainer heading="Transferable" value={transferable} />
            <BalanceContainer heading="Locked" value={lockedBalance} />

            {bonded > 0 && <BalanceContainer heading="Bonded" value={bonded} />}
            {redeemable > 0 && <BalanceContainer heading="Redeemable" value={redeemable} />}
            {unbonding > 0 && <BalanceContainer heading="Unbonding" value={unbonding} />}
          </div>

          <footer className={styles.footer}>
            <GetTestBalance />
            <TransferBalance />
          </footer>
        </div>
      </CSSTransition>
    </div>
  );
};

export { BalanceDropdown };
