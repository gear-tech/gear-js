import React, { useEffect, useState } from 'react';
import { useApi } from 'hooks/useApi';
import { Hex } from '@gear-js/api';
import Box from 'layout/Box/Box';
import { Message } from './children/Message/Message';
import { MessageType } from './types';
import { LOCAL_STORAGE } from 'consts';
import styles from './Mailbox.module.scss';

const Mailbox = () => {
  const [api] = useApi();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const isAnyMessage = messages.length > 0;

  useEffect(() => {
    const publicKey = localStorage.getItem(LOCAL_STORAGE.PUBLIC_KEY_RAW) as Hex;

    if (publicKey) {
      api.mailbox
        .read(publicKey)
        .then((data) => data.toHuman())
        .then((formattedData) => formattedData && setMessages(Object.values(formattedData)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMessages = () => {
    return (
      <div className={styles.messages}>
        {messages.map((message: MessageType) => {
          return <Message key={message.id} message={message} />;
        })}
      </div>
    );
  };

  const renderEmptyBlock = () => {
    return <p className={styles.emptyBlock}>No messages</p>;
  };

  return (
    <div className="wrapper">
      <Box>
        <div className={styles.container}>
          <h2 className={styles.heading}>Mailbox:</h2>
          {isAnyMessage ? getMessages() : renderEmptyBlock()}
        </div>
      </Box>
    </div>
  );
};

export { Mailbox };
