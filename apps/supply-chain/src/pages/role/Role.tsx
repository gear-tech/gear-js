import { Hex } from '@gear-js/api';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ROLES, ACTIONS } from 'consts';
import { getAction, getForm, getLabel, getName } from 'utils';
import { Header } from './header';
import { List } from './list';
import { SelectText } from './select-text';
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

  const Form = getForm(action);

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
          {action ? (
            <Form
              heading={action}
              items={[]}
              action={getAction(action)}
              label={getLabel(action)}
              name={getName(action)}
              onSubmit={() => {}}
            />
          ) : (
            <SelectText value={role ? 'action' : 'role'} />
          )}
        </div>
      </div>
    </div>
  );
}

export { Role };
