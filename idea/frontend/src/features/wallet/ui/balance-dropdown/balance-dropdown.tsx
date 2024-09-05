import { useDeriveBalancesAll } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { Balance as BalanceValue } from '@/features/balance/ui/balance/balance';

import VaraSVG from '../../assets/vara.svg?react';
import SwapSVG from '../../assets/swap.svg?react';
import GiftSVG from '../../assets/gift.svg?react';
import styles from './balance-dropdown.module.scss';

type Props = {
  balance: NonNullable<ReturnType<typeof useDeriveBalancesAll>['data']>;
  onHeaderClick: () => void;
};

function Balance({ heading, value }: { heading: string; value: string }) {
  return (
    <span className={styles.balance}>
      <span className={styles.heading}>{heading}:</span>
      <BalanceValue value={value} />
    </span>
  );
}

function BalanceDropdown({ balance, onHeaderClick }: Props) {
  return (
    <div className={styles.dropdown}>
      <button type="button" className={styles.header} onClick={onHeaderClick}>
        <VaraSVG />
        <Balance heading="Total Balance" value="1000" />
      </button>

      <div className={styles.body}>
        <Balance heading="Transferable" value="1000" />
        <Balance heading="Locked" value="1000000" />
        <Balance heading="Staked" value="1000" />
      </div>

      <footer className={styles.footer}>
        <Button icon={GiftSVG} text="Get Test Balance" color="secondary" size="small" noWrap />
        <Button icon={SwapSVG} text="Transfer" color="grey" size="small" noWrap />
      </footer>
    </div>
  );
}

export { BalanceDropdown };
