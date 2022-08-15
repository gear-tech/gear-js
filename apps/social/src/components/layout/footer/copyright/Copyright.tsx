import styles from './Copyright.module.scss';

function Copyright() {
  const year = new Date().getFullYear();

  return <small className={styles.copyright}>{year}. All rights reserved.</small>;
}

export { Copyright };
