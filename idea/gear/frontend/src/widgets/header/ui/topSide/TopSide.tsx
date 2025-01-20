import { useApi } from '@gear-js/react-hooks';
import { Wallet } from '@gear-js/wallet-connect';
import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { RecentBlocks } from '@/features/recentBlocks';
import { BalanceDropdown } from '@/features/balance';
import { OnboardingTooltip } from '@/shared/ui/onboardingTooltip';
import { AnimationTimeout } from '@/shared/config';

import { TotalIssuance } from '../totalIssuance';
import styles from './TopSide.module.scss';

const TopSide = () => {
  const { api, isApiReady } = useApi();
  const [totalIssuance, setTotalIssuance] = useState('');

  useEffect(() => {
    if (!isApiReady) return;

    api.totalIssuance().then((result) => setTotalIssuance(result.slice(0, 5)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApiReady]);

  return (
    <div className={styles.container}>
      {isApiReady && (
        <CSSTransition in appear timeout={AnimationTimeout.Default}>
          <div className={styles.main}>
            <TotalIssuance totalIssuance={totalIssuance} />
            <RecentBlocks />
          </div>
        </CSSTransition>
      )}

      <div className={styles.wallet}>
        <BalanceDropdown />

        <OnboardingTooltip index={0}>
          <Wallet theme="gear" displayBalance={false} />
        </OnboardingTooltip>
      </div>
    </div>
  );
};

export { TopSide };
