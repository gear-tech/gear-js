import { Hex } from '@gear-js/api';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ACTIONS, ROLES } from 'consts';
import { Header } from './header';
import { List } from './list';
import styles from './Role.module.scss';

type Props = {
  programId: Hex;
  onBackButtonClick: () => void;
};

function Role({ programId, onBackButtonClick }: Props) {
  const [role, setRole] = useState('');
  const [action, setAction] = useState('');

  const resetAction = () => setAction('');
  useEffect(resetAction, [role]);

  return (
    <div className={styles.role}>
      <Header programId={programId} onBackButtonClick={onBackButtonClick} />
      <div className={styles.actions}>
        <p className={clsx(styles.action, !role && styles.active)}>Select role</p>
        {role && <p className={clsx(styles.action, styles.active)}>Select action</p>}
      </div>
      <div className={styles.main}>
        <div className={styles.listWrapper}>
          <List list={ROLES} value={role} onChange={setRole} />
          {role && <List list={ACTIONS[role]} value={action} onChange={setAction} />}
        </div>
        <div className={styles.textWrapper}>
          <div className={styles.text}>
            <p className={styles.heading}>Select {role ? 'action' : 'role'}</p>
            <p className={styles.subheading}>
              Select one of the {role ? 'actions' : 'roles'} in the list on the left to continue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Role };
