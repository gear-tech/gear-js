import { useAccount, useBalance } from 'wagmi';

import { useWrappedVaraBalance } from '@/app/api';
import EthSVG from '@/assets/icons/eth-coin.svg?react';
import VaraSVG from '@/assets/icons/vara-coin.svg?react';
import { formatBalance } from '@/shared/utils';

import styles from './header-balance.module.scss';

const HeaderBalance = () => {
  const ethAccount = useAccount();
  const { value, decimals, isPending } = useWrappedVaraBalance();

  const { data: ethBalance } = useBalance({
    address: ethAccount.address,
  });

  const splittedWVara = !isPending ? formatBalance(value, decimals).split('.') : null;

  const splittedEth = ethBalance ? formatBalance(ethBalance.value, ethBalance.decimals).split('.') : null;

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <VaraSVG />
        <div>
          <div className={styles.name}>WVARA</div>
          {splittedWVara !== null && (
            <div className={styles.value}>
              {splittedWVara[0]}

              {splittedWVara[1] && <span className={styles.decimal}>.{splittedWVara[1]}</span>}
            </div>
          )}
        </div>
      </div>

      <div className={styles.item}>
        <EthSVG />
        <div>
          <div className={styles.name}>ETH</div>
          {splittedEth && (
            <div className={styles.value}>
              {splittedEth[0]}
              <span className={styles.decimal}>.{splittedEth[1]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { HeaderBalance };
