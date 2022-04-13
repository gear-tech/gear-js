import { Button } from '@gear-js/ui';
import CardType from '../types';
import styles from './Card.module.scss';

function Card({ image, collection, name, value, isAuction }: CardType) {
  const valueHeading = isAuction ? 'Top bid' : 'Price';
  const valueText = `${value} Gear`;
  const buttonText = isAuction ? 'Make bid' : 'Buy now';

  return (
    <li className={styles.card}>
      <img src={image} alt={name} className={styles.image} />
      <div className={styles.body}>
        <div>
          <h3 className={styles.heading}>{collection}</h3>
          <p className={styles.text}>{name}</p>
        </div>
        <div className={styles.value}>
          <h3 className={styles.heading}>{valueHeading}</h3>
          <p className={styles.text}>{valueText}</p>
        </div>
      </div>
      <Button text={buttonText} block />
    </li>
  );
}

export default Card;
