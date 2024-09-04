import { useAccount, useApi, useBalanceFormat, useDeriveBalancesAll } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';

import VaraSVG from '../../assets/vara.svg?react';
import styles from './balance.module.scss';

const Balance = () => {
  const { isApiReady } = useApi();
  const { account } = useAccount();
  const { data: balance } = useDeriveBalancesAll({ address: account?.address });
  const { getFormattedBalance } = useBalanceFormat();

  const formattedBalance = isApiReady && balance ? getFormattedBalance(balance.freeBalance) : undefined;
  const splittedBalance = formattedBalance?.value.split('.');

  if (!splittedBalance) return null;

  return (
    <section className={styles.container}>
      <VaraSVG />

      <div>
        <h4 className={styles.heading}>Total balance:</h4>

        <div className={styles.balance}>
          <p>
            <span className={styles.value}>{splittedBalance[0]}</span>
            <span className={styles.unit}>.{splittedBalance[1]}</span>
          </p>

          <Button icon={ArrowSVG} color="transparent" className={styles.button} />
        </div>
      </div>
    </section>
  );
};

export { Balance };
