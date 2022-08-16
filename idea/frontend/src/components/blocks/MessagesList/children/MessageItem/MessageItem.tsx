import { Link, generatePath } from 'react-router-dom';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import styles from './MessageItem.module.scss';

import { routes } from 'routes';
import { copyToClipboard, fileNameHandler, formatDate } from 'helpers';
import { MessageModel } from 'types/message';
import { Tooltip } from 'components/common/Tooltip';
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
    <>
      <div className={styles.item}>
        <CircleIndicator status={status} className={styles.messageStatus} />
        <p>{fileNameHandler(message.destination)}</p>
      </div>
      <div className={styles.item}>
        <Link className={styles.messageLink} to={generatePath(routes.message, { messageId })}>
          {messageId}
        </Link>
        <Tooltip content="Copy ID">
          <Button icon={copySVG} size="small" color="transparent" onClick={handleCopy} />
        </Tooltip>
      </div>
      <div className={styles.item}>
        <p>{formatDate(timestamp)}</p>
      </div>
    </>
  );
};

export { MessageItem };
