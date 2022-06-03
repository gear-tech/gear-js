import { Button } from '@gear-js/ui';
import clsx from 'clsx';
import { IPFS_GATEWAY_ADDRESS } from 'consts';
import { useNft } from 'hooks';
import { Link } from 'react-router-dom';
import styles from './Card.module.scss';

type Props = {
  id: string;
  price: string | null | undefined;
  isAuction: boolean;
  isVisible: boolean;
};

function Card({ id, price, isAuction, isVisible }: Props) {
  const nft = useNft(id);

  const className = clsx(styles.card, !isVisible && styles.hidden);
  const buttonText = isAuction ? 'Make bid' : 'Buy now';
  const priceText = isAuction ? 'Top bid' : 'Price';
  const to = `/listing/${id}`;
  const text = `#${id}`;

  return nft ? (
    <Link to={to} className={className}>
      <img src={`${IPFS_GATEWAY_ADDRESS}/${nft.media}`} alt={nft.name} className={styles.image} />
      <div>
        <div className={styles.body}>
          <div>
            <h3 className={styles.heading}>{nft.name}</h3>
            <p className={styles.text}>{text}</p>
          </div>
          <div className={styles.value}>
            <h3 className={styles.heading}>{priceText}</h3>
            <p className={styles.text}>{price || 'None'}</p>
          </div>
        </div>
      </div>
      {price && <Button text={buttonText} block />}
    </Link>
  ) : null;
}

export default Card;
