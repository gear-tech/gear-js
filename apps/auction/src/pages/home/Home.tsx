import { Button, Input, inputStyles } from '@gear-js/ui';
import styles from './Home.module.scss';

function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Dutch Auction</h2>
      </div>
      <h3 className={styles.subheading}>Sell NFT</h3>
      <div className={styles.info}>
        <p>As the time goes the price becomes lower. You can adjust discount rate per ms.</p>
      </div>
      <form>
        <div className={styles.inputs}>
          <div className={styles.row}>
            <Input type="number" label="Days" className={styles.input} />
            <Input type="number" label="Hours" className={styles.input} />
            <Input type="number" label="Minutes" className={styles.input} />
          </div>
          <Input label="NFT contract address" className={styles.input} />
          <Input type="number" label="Token ID" className={styles.input} />
          <div className={styles.row}>
            <Input type="number" label="Start price" className={styles.input} />
            <Input type="number" label="Discount rate per ms" className={styles.input} />
          </div>
          <p>
            <span className={inputStyles.label}>Final price:</span>
            <span className={styles.price}>00.00</span>
          </p>
        </div>
        <Button type="submit" text="Sell NFT" block />
      </form>
    </div>
  );
}

export { Home };
