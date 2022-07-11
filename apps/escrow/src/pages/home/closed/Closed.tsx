import styles from './Closed.module.scss';

function Closed() {
  return <p className={styles.text}>Wallet is closed, please go back and select or create another one.</p>;
}

export { Closed };
