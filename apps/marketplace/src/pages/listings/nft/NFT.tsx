import { Button } from '@gear-js/ui';
import { IPFS_GATEWAY_ADDRESS } from 'consts';
import { useNft } from 'hooks';
import { Link } from 'react-router-dom';
import styles from './NFT.module.scss';

type Props = {
  id: string;
  price: string | null | undefined;
  isAuction: boolean;
};

function NFT({ id, price, isAuction }: Props) {
  const nft = useNft(id);

  const buttonText = isAuction ? 'Make bid' : 'Buy now';
  const priceText = isAuction ? 'Top bid' : 'Price';
  const to = `/listing/${id}`;
  const text = `#${id}`;

  return nft ? (
    <li>
      <Link to={to} className={styles.nft}>
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
    </li>
  ) : null;
}

export { NFT };
