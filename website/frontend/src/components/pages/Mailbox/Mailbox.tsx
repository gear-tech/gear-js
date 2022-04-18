import React, { useEffect, useState } from 'react';
import { MailboxType } from '@gear-js/api';
import { useApi, useAccount } from 'hooks';
import { Box } from 'layout/Box/Box';
import { Message } from './children/Message/Message';
import styles from './Mailbox.module.scss';

const Mailbox = () => {
  const { api } = useApi();
  const { account } = useAccount();
  const [mailbox, setMailbox] = useState<MailboxType>([]);
  const isAnyMessage = mailbox.length > 0;

  useEffect(() => {
    if (account) {
      api.mailbox.read(account.address).then(setMailbox);
    } else {
      setMailbox([]);
    }
  }, [account, api.mailbox]);

  const getMessages = () => mailbox.map(([, message], index) => <Message key={index} message={message} />);

  return (
    <div className="wrapper">
      <Box className={styles.box}>
        <h2 className={styles.heading}>Mailbox:</h2>
        <div className={styles.messages}>{isAnyMessage ? getMessages() : <p>No messages</p>}</div>
      </Box>
    </div>
  );
};

export { Mailbox };
