import { useAccount, useDeriveBalancesAll, useDeriveStakingAccount } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { Balance as BalanceType } from '@polkadot/types/interfaces';
import clsx from 'clsx';
import { useMemo } from 'react';

import { useModalState } from '@/hooks';
import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';
import { Balance } from '@/features/balance/ui/balance';

import VaraSVG from '../../assets/vara.svg?react';
import SwapSVG from '../../assets/swap.svg?react';
import GiftSVG from '../../assets/gift.svg?react';
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

  const { freeBalance, reservedBalance, availableBalance, lockedBalance } = balance;
  const { bonded, redeemable, unbonding } = stakingBalance;
  const totalBalance = freeBalance.add(reservedBalance).toString();

  return (
    <div className={styles.container}>
      <button type="button" className={styles.button} onClick={isOpen ? close : open}>
        <VaraSVG />

        {/* TODO: change to span */}
        <div>
          <h4 className={styles.heading}>Total balance:</h4>

          <div className={styles.balance}>
            <Balance value={totalBalance} />
            <ArrowSVG className={clsx(styles.arrow, isOpen && styles.open)} />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button type="button" className={styles.header} onClick={close}>
            <VaraSVG />
            <BalanceContainer heading="Total Balance" value={totalBalance} />
          </button>

          <div className={styles.body}>
            {/* should be changed to allBalances?.transferable after @polkadot/api 12.4 update*/}
            <BalanceContainer heading="Transferable" value={availableBalance} />
            <BalanceContainer heading="Locked" value={lockedBalance} />

            {bonded > 0 && <BalanceContainer heading="Bonded" value={bonded} />}
            {redeemable > 0 && <BalanceContainer heading="Redeemable" value={redeemable} />}
            {unbonding > 0 && <BalanceContainer heading="Unbonding" value={unbonding} />}
          </div>

          <footer className={styles.footer}>
            <Button icon={GiftSVG} text="Get Test Balance" color="secondary" size="small" noWrap />
            <Button icon={SwapSVG} text="Transfer" color="grey" size="small" noWrap />
          </footer>
        </div>
      )}
    </div>
  );
};

export { BalanceDropdown };
