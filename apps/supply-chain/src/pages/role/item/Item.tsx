import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import styles from './Item.module.scss';

type Props = {
  data: {
    id: string;
    state: string;
    name: string;
    description: string;
    producer: Hex;
    distributor: Hex;
    retailer: Hex;
  };
  onBackClick: () => void;
};

function Item({ data, onBackClick }: Props) {
  const { id, state, name, description, producer, distributor, retailer } = data;

  return (
    <div>
      <header className={styles.header}>
        <h3 className={styles.heading}>Item info</h3>
        <Button text="Back" color="secondary" size="small" onClick={onBackClick} />
      </header>

      <ul className={styles.list}>
        <li className={styles.item}>
          <span className={styles.key}>Item ID</span>
          <span>{id}</span>
        </li>
        <li className={styles.item}>
          <span className={styles.key}>State</span>
          <span>{state}</span>
        </li>
      </ul>

      <ul className={styles.list}>
        <li className={styles.item}>
          <span className={styles.key}>Name</span>
          <span>{name}</span>
        </li>
        <li className={styles.item}>
          <span className={styles.key}>Description</span>
          <span>{description}</span>
        </li>
      </ul>

      <ul className={styles.list}>
        <li className={styles.item}>
          <span className={styles.key}>Producer</span>
          <span>{producer}</span>
        </li>
        <li className={styles.item}>
          <span className={styles.key}>Distributor</span>
          <span>{distributor}</span>
        </li>
        <li className={styles.item}>
          <span className={styles.key}>Retailer</span>
          <span>{retailer}</span>
        </li>
      </ul>
    </div>
  );
}

export { Item };
