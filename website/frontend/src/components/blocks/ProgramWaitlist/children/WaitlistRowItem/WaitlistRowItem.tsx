import { generatePath, Link } from 'react-router-dom';
import { WaitlistItem } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import styles from './WaitlistRowItem.module.scss';

import { routes } from 'routes';
import { copyToClipboard } from 'helpers';
import copySVG from 'assets/images/copy.svg';

const WaitlistRowItem = ({ programId, messageId, blockNumber }: WaitlistItem) => {
  const alert = useAlert();

  const handleCopy = () => copyToClipboard(messageId!, alert, 'Message ID copied');

  return (
    <>
      <span className={styles.text}>{programId}</span>
      <div className={styles.message}>
        <Link className={styles.messageLink} to={generatePath(routes.message, { messageId })}>
          {messageId}
        </Link>
        <Button icon={copySVG} size="small" color="transparent" className={styles.copyButton} onClick={handleCopy} />
      </div>
      <span className={styles.text}>{blockNumber} blocks</span>
    </>
  );
};

export { WaitlistRowItem };
