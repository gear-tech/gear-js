import EthSVG from '@/assets/icons/eth-coin.svg?react';
import VaraSVG from '@/assets/icons/vara-coin.svg?react';

import styles from './header-balance.module.scss';

const HeaderBalance = () => {
  // ! TODO: get real and transform
  const wvara = 2141249.4578;
  const eth = 123.3445;

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <VaraSVG />
        <div>
          <div className={styles.name}>WVARA</div>
          <div className={styles.value}>
            {wvara}
            <span className={styles.decimal}></span>
          </div>
        </div>
      </div>

      <div className={styles.item}>
        <EthSVG />
        <div>
          <div className={styles.name}>ETH</div>
          <div className={styles.value}>
            {eth}
            <span className={styles.decimal}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HeaderBalance };
