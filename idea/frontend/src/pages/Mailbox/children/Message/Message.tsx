import { useState } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { Hex } from '@gear-js/api';
import { Button, buttonStyles } from '@gear-js/ui';
import clsx from 'clsx';

import styles from './Message.module.scss';

import { routes } from 'routes';
import { getPreformattedText } from 'helpers';
import { HumanMailboxItem } from 'types/api';
import claimSVG from 'assets/images/claim.svg';
import letterSVG from 'assets/images/letter.svg';
import messageSVG from 'assets/images/message.svg';

type Props = {
  message: HumanMailboxItem;
  onClaim: (messageId: Hex, reject: () => void) => void;
};

const Message = ({ message, onClaim }: Props) => {
  const messageId = message[0].id;

  const [isLoading, setIsLoading] = useState(false);

  const handleClaim = () => {
    setIsLoading(true);

    onClaim(messageId, () => setIsLoading(false));
  };

  const replyPath = generatePath(`${routes.send}/${routes.reply}`, { messageId });
  const messagePath = generatePath(routes.message, { messageId });

  const iconClasses = clsx(buttonStyles.icon, styles.replyLinkIcon);
  const linkClasses = clsx(buttonStyles.button, buttonStyles.small);

  return (
    <div className={styles.message}>
      <pre className={styles.pre}>{getPreformattedText(message)}</pre>
      <div className={styles.actions}>
        <Link to={replyPath} className={clsx(linkClasses, buttonStyles.primary)}>
          <img className={iconClasses} src={messageSVG} alt="send reply icon" />
          Send reply
        </Link>
        <Link to={messagePath} className={clsx(linkClasses, buttonStyles.secondary)}>
          <img className={iconClasses} src={letterSVG} alt="letter icon" />
          Go to message
        </Link>
        <Button
          size="small"
          icon={claimSVG}
          text="Claim value"
          color="secondary"
          disabled={isLoading}
          onClick={handleClaim}
        />
      </div>
    </div>
  );
};

export { Message };
