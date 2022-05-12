import { Button } from '@gear-js/ui';
import styles from './Offer.module.scss';

type Props = {
  bid: number;
  bidder: string;
};

function Offer({ bid, bidder }: Props) {
  const bidText = `${bid} Gear`;

  return (
    <div className={styles.offer}>
      <div className={styles.info}>
        <p className={styles.bid}>{bidText}</p>
        <p className={styles.bidder}>{bidder}</p>
      </div>
      <Button text="Accept" size="small" />
    </div>
  );
}

export default Offer;
