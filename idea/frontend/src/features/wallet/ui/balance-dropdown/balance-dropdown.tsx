import { useAccount, useDeriveBalancesAll, useDeriveStakingAccount } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { Balance as BalanceType } from '@polkadot/types/interfaces';
import { BN, BN_ZERO } from '@polkadot/util';
import clsx from 'clsx';
import { useMemo } from 'react';

import { useModalState } from '@/hooks';
import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';
import { Balance } from '@/features/balance/ui/balance';

import VaraSVG from '../../assets/vara.svg?react';
import SwapSVG from '../../assets/swap.svg?react';
import GiftSVG from '../../assets/gift.svg?react';
import styles from './balance-dropdown.module.scss';

function BalanceContainer({ heading, value }: { heading: string; value: BalanceType | string }) {
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
    if (!stakingAccount?.unlocking) return BN_ZERO;

    const filtered = stakingAccount.unlocking
      .filter(({ remainingEras, value }) => value.gt(BN_ZERO) && remainingEras.gt(BN_ZERO))
      .map((unlock) => unlock.value);

    const total = filtered.reduce((acc, value) => acc.iadd(value), new BN(0));

    return total;
  };

  const stakingBalance = useMemo(() => {
    if (!stakingAccount) return;

    const bonded = stakingAccount.stakingLedger.active.unwrap();
    const redeemable = stakingAccount.redeemable || BN_ZERO;
    const unbonding = getUnbondingBalance();

    return { bonded, redeemable, unbonding };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stakingAccount]);

  if (!balance || !stakingBalance) return null;

  return (
    <div className={styles.container}>
      <button type="button" className={styles.button} onClick={isOpen ? close : open}>
        <VaraSVG />

        {/* TODO: change to span */}
        <div>
          <h4 className={styles.heading}>Total balance:</h4>

          <div className={styles.balance}>
            <Balance value={balance.freeBalance} />
            <ArrowSVG className={clsx(styles.arrow, isOpen && styles.open)} />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button type="button" className={styles.header} onClick={close}>
            <VaraSVG />

            <BalanceContainer
              heading="Total Balance"
              value={balance.freeBalance.add(balance.reservedBalance).toString()}
            />
          </button>

          <div className={styles.body}>
            {/* should be changed to allBalances?.transferable after @polkadot/api 12.4 update*/}
            <BalanceContainer heading="Transferable" value={balance.availableBalance} />
            <BalanceContainer heading="Locked" value={balance.lockedBalance} />

            {stakingBalance.bonded.gtn(0) && <BalanceContainer heading="Bonded" value={stakingBalance.bonded} />}

            {stakingBalance.redeemable.gtn(0) && (
              <BalanceContainer heading="Redeemable" value={stakingBalance.redeemable.toString()} />
            )}

            {stakingBalance.unbonding.gtn(0) && (
              <BalanceContainer heading="Unbonding" value={stakingBalance.unbonding.toString()} />
            )}
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
