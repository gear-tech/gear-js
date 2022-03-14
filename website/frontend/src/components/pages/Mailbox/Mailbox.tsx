import React, { FC, useEffect, useState } from 'react';
import { useApi } from 'hooks/useApi';
import { Hex } from '@gear-js/api';
import { Box } from 'layout/Box/Box';
import { MailItem } from './children/MailItem/MailItem';
import { Mail } from './types';
import { getMails } from './helpers';
import { LOCAL_STORAGE } from 'consts';
import styles from './Mailbox.module.scss';

export const Mailbox: FC = () => {
  const [api] = useApi();
  const [mails, setMails] = useState<Mail[]>([]);

  useEffect(() => {
    const publicKey = localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW) as Hex;

    getMails(api, publicKey, setMails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <div className={styles.item}>
        <h2 className={styles.heading}>Mailbox:</h2>
        {mails && mails.length ? (
          <div className={styles.list}>
            {mails.map((elem: Mail) => {
              return <MailItem key={elem.id} elem={elem} />;
            })}
          </div>
        ) : (
          <p className={styles.empty}>No messages</p>
        )}
      </div>
    </Box>
  );
};
