import clsx from 'clsx';
import { Link, generatePath } from 'react-router-dom';
import { Button } from '@gear-js/ui';

import styles from './MessageItem.module.scss';

import { routes } from 'routes';
import { useAlert } from 'hooks';
import { copyToClipboard, fileNameHandler, formatDate } from 'helpers';
import { MessageModel } from 'types/message';
import copyIcon from 'assets/images/copy.svg';
import { CircleIndicator, IndicatorStatus } from 'components/common/CircleIndicator';

type Props = {
  message: MessageModel;
};

const MessageItem = ({ message }: Props) => {
  const alert = useAlert();

  const { id: messageId, exitCode, timestamp } = message;

  const handleCopy = () => copyToClipboard(messageId, alert, 'Message ID copied');

  const status = exitCode ? IndicatorStatus.Error : IndicatorStatus.Success;

  return (
    <li className={clsx(styles.messageItem, exitCode ? styles.error : styles.success)}>
      <div className={styles.itemCol}>
        <CircleIndicator status={status} className={styles.messageStatus} />
        <p>{fileNameHandler(message.destination)}</p>
      </div>
      <div className={styles.itemCol}>
        <Link className={styles.messageLink} to={generatePath(routes.message, { messageId })}>
          {messageId}
        </Link>
        <Button icon={copyIcon} size="small" color="transparent" className={styles.copyButton} onClick={handleCopy} />
      </div>
      <div className={styles.itemCol}>
        <p>{formatDate(timestamp)}</p>
      </div>
    </li>
  );
};

export { MessageItem };
