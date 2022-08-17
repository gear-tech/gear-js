import { Hex } from '@gear-js/api';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ROLES, ACTIONS } from 'consts';
import { getAction, getForm, getItemData, getLabel, getName } from 'utils';
import { useItem, useItems, useNft, useSubmit } from 'hooks';
import { Loader } from 'components';
import { Header } from './header';
import { List } from './list';
import { SelectText } from './select-text';
import { Item } from './item';
import styles from './Program.module.scss';

type Props = {
  id: Hex;
  onBackButtonClick: () => void;
};

function Program({ id, onBackButtonClick }: Props) {
  const [role, setRole] = useState('');
  const [action, setAction] = useState('');
  const { handleSubmit, itemId, resetItem } = useSubmit(role, action);

  const { item, isItemRead } = useItem(itemId);
  const { items, isEachItemRead } = useItems();
  const { nft, isNftRead } = useNft(itemId);
  const isItemReady = item && isItemRead && nft && isNftRead;
  const isEachItemReady = items && isEachItemRead;

  const resetAction = () => setAction('');
  useEffect(resetAction, [role]);

  const Form = getForm(action);

  return (
    <div className={styles.role}>
      <Header programId={id} onBackButtonClick={onBackButtonClick} />
      <div className={styles.actions}>
        <p className={clsx(styles.action, !role && styles.active)}>Select role</p>
        {role && <p className={clsx(styles.action, styles.active)}>Select action</p>}
      </div>
      <div className={styles.main}>
        <List list={ROLES} value={role} onChange={setRole} />
        {role && <List list={ACTIONS[role]} value={action} onChange={setAction} />}
        <div className={styles.action}>
          {action ? (
            <>
              {itemId &&
                (isItemReady ? <Item id={itemId} data={getItemData(item, nft)} onBackClick={resetItem} /> : <Loader />)}
              {!itemId &&
                (isEachItemReady ? (
                  <Form
                    heading={action}
                    items={Object.keys(items)}
                    action={getAction(action)}
                    label={getLabel(action)}
                    name={getName(action)}
                    onSubmit={handleSubmit}
                  />
                ) : (
                  <Loader />
                ))}
            </>
          ) : (
            <SelectText value={role ? 'action' : 'role'} />
          )}
        </div>
      </div>
    </div>
  );
}

export { Program };
