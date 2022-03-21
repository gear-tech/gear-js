import React, { useEffect, useState } from 'react';
import { QueuedMessage } from '@gear-js/api';
import { BTreeMap, Option } from '@polkadot/types';
import { H256 } from '@polkadot/types/interfaces';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { useApi } from 'hooks/useApi';
import Box from 'layout/Box/Box';
import { Message } from './children';
import styles from './Mailbox.module.scss';

type QueuedMessages = QueuedMessage[];
type QueuedMessagesOption = Option<BTreeMap<H256, QueuedMessage>>;

const Mailbox = () => {
  const [api] = useApi();
  const { account } = useSelector((state: RootState) => state.account);
  const [messages, setMessages] = useState<QueuedMessages>([]);
  const isAnyMessage = messages.length > 0;

  const getQueuedMessages = (option: QueuedMessagesOption) => {
    const queuedMessages: QueuedMessages = [];

    if (option.isSome) {
      option.unwrap().forEach((message) => queuedMessages.push(message));
    }

    return queuedMessages;
  };

  useEffect(() => {
    if (account) {
      api.mailbox.read(account.address).then(getQueuedMessages).then(setMessages);
    } else {
      setMessages([]);
    }
  }, [account, api.mailbox]);

  const getMessages = () => messages.map((message, index) => <Message key={index} message={message} />);

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
