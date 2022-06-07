import { Link } from 'react-router-dom';
import { getIpfsAddress } from 'utils';
import styles from './NFT.module.scss';

type Props = {
  id: string;
  name: string;
  media: string;
};

function NFT({ id, name, media }: Props) {
  const to = `/nft/${id}`;
  const src = getIpfsAddress(media);
  const text = `#${id}`;

  return (
    <Link to={to} className={styles.nft}>
      <img src={src} alt={name} className={styles.image} />
      <h3 className={styles.heading}>{name}</h3>
      <p className={styles.text}>{text}</p>
    </Link>
  );
}

export { NFT };
