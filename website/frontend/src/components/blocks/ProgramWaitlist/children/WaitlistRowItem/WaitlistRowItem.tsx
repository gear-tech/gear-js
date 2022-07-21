import { generatePath } from 'react-router-dom';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import styles from './WaitlistRowItem.module.scss';

import { routes } from 'routes';
import { copyToClipboard } from 'helpers';
import { WaitlistContent, Interval } from 'types/api';
import { CustomLink } from 'components/common/CustomLink';
import copySVG from 'assets/images/copy.svg';

type Props = {
  content: WaitlistContent;
  interval: Interval;
};

const WaitlistRowItem = ({ content, interval }: Props) => {
  const alert = useAlert();

  const messageId = content.message.id;

  const handleCopy = () => copyToClipboard(messageId, alert, 'Message ID copied');

  return (
    <>
      <div className={styles.message}>
        <CustomLink to={generatePath(routes.message, { messageId })} text={messageId} />
        <Button icon={copySVG} size="small" color="transparent" className={styles.copyButton} onClick={handleCopy} />
      </div>
      <span className={styles.text}>{content.kind}</span>
      <span className={styles.text}>{interval.start}</span>
      <span className={styles.text}>{interval.finish}</span>
    </>
  );
};

export { WaitlistRowItem };
