import { Button } from '@gear-js/ui';
import clsx from 'clsx';
import { Content } from 'components';
import styles from './Buy.module.scss';
import { Countdown } from './countdown';
import placeholder from './placeholder.png';

function Buy() {
  const countdownClassName = clsx(styles.text, styles.countdown);

  return (
    <div className={styles.container}>
      <div className={styles.imgWrapper}>
        <img src={placeholder} alt="" className={styles.image} />
      </div>
      <Content heading="Buy NFT" className={styles.content}>
        <p className={countdownClassName}>
          <span className={styles.key}>Time left:</span>
          <Countdown days="00" minutes="00" seconds="00" />
        </p>
        <p className={styles.text}>
          <span className={styles.key}>Owner address:</span>
          <span className={styles.value}>Value</span>
        </p>
        <p className={styles.text}>
          <span className={styles.key}>Contract address:</span>
          <span className={styles.value}>Value</span>
        </p>
        <p className={styles.text}>
          <span className={styles.key}>Token ID:</span>
          <span className={styles.value}>Value</span>
        </p>
        <div className={styles.prices}>
          <p className={styles.text}>
            <span className={styles.key}>Start price:</span>
            <span className={styles.value}>Value</span>
          </p>
          <p className={styles.text}>
            <span className={styles.key}>Current price:</span>
            <span className={styles.value}>Value</span>
          </p>
        </div>
        <Button text="Buy item" block />
      </Content>
    </div>
  );
}

export { Buy };
