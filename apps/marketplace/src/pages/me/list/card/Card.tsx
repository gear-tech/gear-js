// import { Button } from '@gear-js/ui';
import { Link } from 'react-router-dom';
import { NFT } from 'types';
import styles from './Card.module.scss';

function Card({ id, name, media }: Partial<NFT>) {
  // const valueHeading = isAuction ? 'Top bid' : 'Price';
  // const valueText = `${value} Gear`;
  // const buttonText = isAuction ? 'Make bid' : 'Buy now';
  const to = `/listing/${id}`;
  const text = `#${id}`;

  return (
    <Link to={to} className={styles.card}>
      <img src={media} alt={name} className={styles.image} />
      <div>
        {/* <div> */}
        {/* <div> */}
        <h3 className={styles.heading}>{name}</h3>
        <p className={styles.text}>{text}</p>
        {/* </div> */}

        {/* </div>
        <div className={styles.value}>
          <h3 className={styles.heading}>{valueHeading}</h3>
          <p className={styles.text}>{valueText}</p>
        </div> */}
      </div>
      {/* <Button text={buttonText} block /> */}
    </Link>
  );
}

export default Card;
