import { Button } from '@gear-js/ui';
import { Content } from 'components';
import styles from './Buy.module.scss';
import placeholder from './placeholder.png';

function Buy() {
  return (
    <div className={styles.container}>
      <div className={styles.imgWrapper}>
        <img src={placeholder} alt="" className={styles.image} />
      </div>
      <Content heading="Buy NFT" className={styles.content}>
        <p className={styles.text}>
          <span className={styles.key}>Time left:</span>
          <span className={styles.value}>Value</span>
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
