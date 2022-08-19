import { Hex } from '@gear-js/api';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ACTIONS, USER } from 'consts';
import { getAction, getForm, getItemData, getLabel, getName, getFilteredItems } from 'utils';
import { useItem, useItems, useNft, useRoles, useSubmit } from 'hooks';
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
  const { nft, isNftRead } = useNft(itemId);
  const isItemReady = item && isItemRead && nft && isNftRead;

  const { items, isEachItemRead } = useItems();
  const isEachItemReady = items && isEachItemRead;

  const { roles, isEachRoleRead } = useRoles();
  const isEachRoleReady = roles && isEachRoleRead;

  const resetAction = () => setAction('');
  useEffect(resetAction, [role]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(resetItem, [action]);

  const Form = getForm(action);

  const roleTextClassName = clsx(styles.action, !role && styles.active);
  const actionTextClassName = clsx(styles.action, styles.active);

  const rolesList = roles ? [...roles, USER.CONSUMER] : [];
  const actionsList = ACTIONS[role];
  const selectTextValue = role ? 'action' : 'role';

  return (
    <div className={styles.program}>
      <Header programId={id} onBackButtonClick={onBackButtonClick} />
      <div className={styles.body}>
        {isEachRoleReady && isEachItemReady ? (
          <>
            <div className={styles.actions}>
              <p className={roleTextClassName}>Select role</p>
              {role && <p className={actionTextClassName}>Select action</p>}
            </div>
            <div className={styles.main}>
              <List list={rolesList} value={role} onChange={setRole} />
              {role && <List list={actionsList} value={action} onChange={setAction} />}
              <div className={styles.action}>
                {action ? (
                  <>
                    {itemId &&
                      (isItemReady ? (
                        <Item id={itemId} data={getItemData(item, nft)} onBackClick={resetItem} />
                      ) : (
                        <Loader />
                      ))}
                    {!itemId && (
                      <Form
                        heading={action}
                        items={getFilteredItems(items, role, action)}
                        action={getAction(action)}
                        label={getLabel(action)}
                        name={getName(action)}
                        onSubmit={handleSubmit}
                      />
                    )}
                  </>
                ) : (
                  <SelectText value={selectTextValue} />
                )}
              </div>
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}

export { Program };
