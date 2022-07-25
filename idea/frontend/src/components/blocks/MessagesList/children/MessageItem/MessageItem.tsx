import { Link, generatePath } from 'react-router-dom';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import styles from './MessageItem.module.scss';

import { routes } from 'routes';
import { copyToClipboard, fileNameHandler, formatDate } from 'helpers';
import { MessageModel } from 'types/message';
import { CircleIndicator, IndicatorStatus } from 'components/common/CircleIndicator';
import copySVG from 'assets/images/copy.svg';

type Props = {
  message: MessageModel;
};

const MessageItem = ({ message }: Props) => {
  const alert = useAlert();

  const { id: messageId, exitCode, timestamp } = message;

  const handleCopy = () => copyToClipboard(messageId, alert, 'Message ID copied');

  const status = exitCode ? IndicatorStatus.Error : IndicatorStatus.Success;

  return (
    <li className={styles.messageItem}>
      <div className={styles.itemCol}>
        <CircleIndicator status={status} className={styles.messageStatus} />
        <p>{fileNameHandler(message.destination)}</p>
      </div>
      <div className={styles.itemCol}>
        <Link className={styles.messageLink} to={generatePath(routes.message, { messageId })}>
          {messageId}
        </Link>
        <Button icon={copySVG} size="small" color="transparent" className={styles.copyButton} onClick={handleCopy} />
      </div>
      <div className={styles.itemCol}>
        <p>{formatDate(timestamp)}</p>
      </div>
    </li>
  );
};

export { MessageItem };
