import { Button } from '@gear-js/ui';
import styles from './Main.module.scss';

type Props = {
  name: string;
  media: string;
  onAuctionButtonClick: () => void;
  onSaleButtonClick: () => void;
  isListed: boolean;
  isSale: boolean;
  isAuction: boolean;
  isOwner: boolean;
};

function Main({ media, name, onAuctionButtonClick, onSaleButtonClick, isListed, isSale, isAuction, isOwner }: Props) {
  return (
    <div className={styles.main}>
      <div className={styles.card}>
        <img src={media} alt={name} className={styles.image} />
      </div>
      <div className={styles.buttons}>
        {!isListed && isOwner && (
          <>
            <Button text="Start auction" className={styles.button} onClick={onAuctionButtonClick} />
            <Button text="Start sale" className={styles.button} onClick={onSaleButtonClick} />
          </>
        )}
        {isSale && !isOwner && (
          <>
            <Button text="Make offer" color="secondary" className={styles.button} onClick={onAuctionButtonClick} />
            <Button text="Buy now" className={styles.button} onClick={onSaleButtonClick} />
          </>
        )}
        {isAuction && !isOwner && (
          <>
            <p>Auction ends in </p>
            <Button text="Make bid" className={styles.button} onClick={onSaleButtonClick} />
          </>
        )}
      </div>
    </div>
  );
}

export default Main;
