import { Button } from '@gear-js/ui';
import styles from './Main.module.scss';

type Props = {
  name: string;
  media: string;
  onAuctionButtonClick: () => void;
  onSaleButtonClick: () => void;
};

function Main({ media, name, onAuctionButtonClick, onSaleButtonClick }: Props) {
  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <img src={media} alt={name} className={styles.image} />
      </div>
      <div className={styles.buttons}>
        <Button text="Start auction" className={styles.button} onClick={onAuctionButtonClick} />
        <Button text="Start sale" className={styles.button} onClick={onSaleButtonClick} />
      </div>
    </div>
  );
}

export default Main;
