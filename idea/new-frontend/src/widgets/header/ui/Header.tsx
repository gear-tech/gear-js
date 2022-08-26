import { useEffect, useState } from 'react';
import { useApi, useAccount } from '@gear-js/react-hooks';

import styles from './Header.module.scss';
import { RecentBlock } from './recentBlock';
import { BalanceInfo } from './balanceInfo';
import { TotalIssuance } from './totalIssuance';

const Header = () => {
  const { api } = useApi();
  const { account } = useAccount();

  const [totalIssuance, setTotalIssuance] = useState('');

  useEffect(() => {
    api.totalIssuance().then((result) => setTotalIssuance(result.slice(0, 5)));
  }, [api]);

  return (
    <header className={styles.header}>
      <TotalIssuance totalIssuance={totalIssuance} />
      <RecentBlock />
      <div className={styles.rightSide}>
        {account && (
          <BalanceInfo unit={account.balance.unit || ''} value={account.balance.value} address={account.address} />
        )}
        <span />
      </div>
    </header>
  );
};

export { Header };
