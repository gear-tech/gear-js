import { useAccount, useApi, useBalanceFormat, useDeriveBalancesAll } from '@gear-js/react-hooks';

import { useModalState } from '@/hooks';
import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';

import VaraSVG from '../../assets/vara.svg?react';
import styles from './balance.module.scss';
import { BalanceDropdown } from '../balance-dropdown';
import clsx from 'clsx';

const Balance = () => {
  const { isApiReady } = useApi();
  const { account } = useAccount();
  const { data: balance } = useDeriveBalancesAll({ address: account?.address });
  const { getFormattedBalance } = useBalanceFormat();

  const formattedBalance = isApiReady && balance ? getFormattedBalance(balance.freeBalance) : undefined;
  const splittedBalance = formattedBalance?.value.split('.');

  const [isOpen, open, close] = useModalState();

  if (!balance || !splittedBalance) return null;

  return (
    <div className={styles.container}>
      <button type="button" className={styles.button} onClick={isOpen ? close : open}>
        <VaraSVG />

        {/* TODO: change to span */}
        <div>
          <h4 className={styles.heading}>Total balance:</h4>

          <div className={styles.balance}>
            <p>
              <span className={styles.value}>{splittedBalance[0]}</span>
              <span className={styles.unit}>.{splittedBalance[1]}</span>
            </p>

            <ArrowSVG className={clsx(styles.arrow, isOpen && styles.open)} />
          </div>
        </div>
      </button>

      {isOpen && <BalanceDropdown balance={balance} onHeaderClick={close} />}
    </div>
  );
};

export { Balance };
