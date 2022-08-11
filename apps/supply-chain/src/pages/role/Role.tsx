import { Hex } from '@gear-js/api';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ACTIONS, ROLES } from 'consts';
import { Form, Input } from 'components';
import { Header } from './header';
import { List } from './list';
import styles from './Role.module.scss';
import { SelectText } from './select-text';
import { Approve, Produce, Sale, Ship } from './forms';

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
        <List list={ROLES} value={role} onChange={setRole} />
        {role && <List list={ACTIONS[role]} value={action} onChange={setAction} />}
        <div className={styles.action}>
          {/* <SelectText value={role ? 'action' : 'role'} /> */}
          {/* <Produce heading="t" /> */}
          {/* <Sale heading="t" onSubmit={() => {}} items={['0']} /> */}
          {/* <Approve heading="t" onSubmit={() => {}} items={['0']} /> */}
          <Ship heading="t" onSubmit={() => {}} items={['0']} />
        </div>
      </div>
    </div>
  );
}

export { Role };
