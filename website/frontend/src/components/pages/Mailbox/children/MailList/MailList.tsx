import React, { FC, useEffect, useState } from 'react';
import { useApi } from 'hooks/useApi';
import { Hex } from '@gear-js/api';
import { Spinner } from 'components/blocks/Spinner/Spinner';
import { useMailBoxContext } from '../../context/context';
import { MailItem } from './children/MailItem/MailItem';
import { getMails } from '../../helpers';
import { LOCAL_STORAGE } from 'consts';

import styles from './MailList.module.scss';

export const MailList: FC = () => {
  const [api] = useApi();
  const { state, dispatch } = useMailBoxContext();

  useEffect(() => {
    const publicKey = localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW) as Hex;

    getMails(api, publicKey, dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.item}>
      <p className={styles.caption}>Mailbox:</p>
      {state.mails && state.mails.length ? (
        <div className={styles.list}>
          {state.mails.map((elem: any) => {
            return <MailItem key={elem.id} elem={elem} />;
          })}
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
