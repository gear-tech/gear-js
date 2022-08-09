import styles from './List.module.scss';

function List() {
  return (
    <ul>
      <li className={styles.item}>Producer</li>
      <li className={styles.item}>Distributor</li>
      <li className={styles.item}>Retailer</li>
      <li className={styles.item}>Consumer</li>
    </ul>
  );
}

export { List };
