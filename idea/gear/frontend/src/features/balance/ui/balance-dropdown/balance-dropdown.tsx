import { useAccount, useDeriveBalancesAll, useDeriveStakingAccount } from '@gear-js/react-hooks';
import { Balance as BalanceType } from '@polkadot/types/interfaces';
import { Ref, useMemo } from 'react';

import { useModalState, useOutsideClick } from '@/hooks';
import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';
import { AnimationTimeout } from '@/shared/config';
import { CSSTransitionWithRef } from '@/shared/ui';

import VaraSVG from '../../assets/vara.svg?react';
import { Balance } from '../balance';
import { GetTestBalance } from '../get-test-balance';
import { TransferBalance } from '../transfer-balance';

import styles from './balance-dropdown.module.scss';

function BalanceContainer({ heading, value }: { heading: string; value: BalanceType | string | bigint }) {
  return (
    <span className={styles.balance}>
      <span className={styles.heading}>{heading}:</span>
      <Balance value={value} />
    </span>
  );
}

type Props = {
  total: string;
  transferable: BalanceType;
  lockedBalance: BalanceType;
  ref?: Ref<HTMLDivElement>; // TODO(#1780): temporary react 19 patch
  onHeaderClick: () => void;
};

function Dropdown({ ref, total, transferable, lockedBalance, onHeaderClick }: Props) {
  const { account } = useAccount();
  const { data: stakingAccount } = useDeriveStakingAccount({ address: account?.address });

  const getUnbondingBalance = () => {
    if (!stakingAccount?.unlocking) return 0n;

    return stakingAccount.unlocking.reduce((acc, unlock) => {
      const remainingEras = BigInt(unlock.remainingEras.toString());
      const value = unlock.value.toBigInt();

      return remainingEras > 0 && value > 0 ? acc + value : acc;
    }, 0n);
  };

  const stakingBalance = useMemo(() => {
    const bonded = stakingAccount?.stakingLedger.active.unwrap().toBigInt() || 0n;
    const redeemable = stakingAccount?.redeemable?.toBigInt() || 0n;
    const unbonding = getUnbondingBalance();

    return { bonded, redeemable, unbonding };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingAccount]);

  const { bonded, redeemable, unbonding } = stakingBalance;

  return (
    <div className={styles.dropdown} ref={ref}>
      <button type="button" className={styles.header} onClick={onHeaderClick}>
        <VaraSVG />
        <BalanceContainer heading="Total Balance" value={total} />
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
        <TransferBalance onClick={onHeaderClick} />
      </footer>
    </div>
  );
}

function BalanceDropdown() {
  const { account } = useAccount();
  const { data: balance } = useDeriveBalancesAll({ address: account?.address, watch: true });
  const [isOpen, open, close] = useModalState();
  const ref = useOutsideClick<HTMLDivElement>(close);

  if (!balance) return null;

  const { freeBalance, reservedBalance, transferable, availableBalance, lockedBalance } = balance;

  return (
    <div className={styles.container} ref={ref}>
      <button type="button" className={styles.button} onClick={isOpen ? close : open}>
        <VaraSVG />

        <span className={styles.balance}>
          <span className={styles.heading}>Transferable Balance:</span>

          <span>
            <Balance value={transferable || availableBalance} hideUnit />
            <ArrowSVG className={styles.arrow} />
          </span>
        </span>
      </button>

      <CSSTransitionWithRef in={isOpen} timeout={AnimationTimeout.Default} mountOnEnter unmountOnExit>
        <Dropdown
          total={freeBalance.add(reservedBalance).toString()}
          transferable={transferable || availableBalance}
          lockedBalance={lockedBalance}
          onHeaderClick={close}
        />
      </CSSTransitionWithRef>
    </div>
  );
}

export { BalanceDropdown };
