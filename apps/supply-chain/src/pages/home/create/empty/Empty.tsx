import styles from './Empty.module.scss';

function Empty() {
  return (
    <div className={styles.empty}>
      <p className={styles.heading}>Nobody&apos;s here</p>
      <p className={styles.subheading}>Type user ID and click one of the button to add users</p>
    </div>
  );
}

export { Empty };
