import { Hex } from '@gear-js/api';
import { Header } from './header';
import { List } from './list';
import styles from './Role.module.scss';

type Props = {
  programId: Hex;
  onBackButtonClick: () => void;
};

function Role({ programId, onBackButtonClick }: Props) {
  return (
    <div className={styles.role}>
      <Header programId={programId} onBackButtonClick={onBackButtonClick} />
      <div className={styles.actions}>
        <p className={styles.action}>Select role</p>
      </div>
      <div className={styles.main}>
        <div className={styles.listWrapper}>
          <List />
        </div>
        <div className={styles.textWrapper}>
          <div className={styles.text}>
            <p className={styles.heading}>Select role</p>
            <p className={styles.subheading}>Select one of the roles in the list on the left to continue</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Role };
