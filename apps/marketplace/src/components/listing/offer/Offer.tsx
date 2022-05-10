import { Button } from '@gear-js/ui';
import styles from './Offer.module.scss';

type Props = {
  bid: number;
  bidder: string;
  time: string;
};

function Offer({ bid, bidder, time }: Props) {
  const bidText = `${bid} Gear`;

  return (
    <div className={styles.offer}>
      <div className={styles.info}>
        <p className={styles.bid}>{bidText}</p>
        <p className={styles.bidder}>{bidder}</p>
        <p className={styles.time}>{time}</p>
      </div>
      <Button text="Accept" size="small" />
    </div>
  );
}

export default Offer;
