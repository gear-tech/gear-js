import React, { useEffect, useState } from 'react';
import { useApi } from 'hooks/useApi';
import Box from 'layout/Box/Box';
import Message from './children/Message/Message';
import { MessageType } from './types';
import { LOCAL_STORAGE } from 'consts';
import styles from './Mailbox.module.scss';

const Mailbox = () => {
  const [api] = useApi();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const isAnyMessage = messages.length > 0;

  useEffect(() => {
    const publicKey = localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW);

    if (publicKey) {
      api.mailbox
        .read(publicKey)
        .then((data) => data.toHuman())
        .then((formattedData) => formattedData && setMessages(Object.values(formattedData)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMessages = () => messages.map((message) => <Message key={message.id} message={message} />);

  return (
    <div className="wrapper">
      <Box className={styles.box}>
        <h2 className={styles.heading}>Mailbox:</h2>
        <div className={styles.messages}>{isAnyMessage ? getMessages() : <p>No messages</p>}</div>
      </Box>
    </div>
  );
};

export default Mailbox;
