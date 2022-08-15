import { useMessages } from 'hooks';
import { Loader, MessageItem } from 'components';

import styles from './Messages.module.scss';

function Messages() {
  const { messages } = useMessages();

  const message = messages?.map(({ text, timestamp, owner }) => (
    <MessageItem text={text} owner={owner} key={timestamp.replaceAll(',', '')} />
  ));

  return <div className={styles.container}>{messages ? message?.reverse() : <Loader />}</div>;
}

export { Messages };
