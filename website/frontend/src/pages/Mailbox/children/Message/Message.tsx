import { useState } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { Hex, HumanedMessage } from '@gear-js/api';
import { Button, buttonStyles } from '@gear-js/ui';
import clsx from 'clsx';

import styles from './Message.module.scss';

import { routes } from 'routes';
import { getPreformattedText } from 'helpers';
import claimSVG from 'assets/images/claim.svg';
import messageSVG from 'assets/images/message.svg';

type Props = {
  message: HumanedMessage;
  onClaim: (messageId: Hex) => Promise<void>;
};

const Message = ({ message, onClaim }: Props) => {
  const messageId = message.id;

  const [isLoading, setIsLoading] = useState(false);

  const handleClaim = () => {
    setIsLoading(true);

    onClaim(messageId).catch(() => setIsLoading(false));
  };

  const pathTo = generatePath(`${routes.send}/${routes.reply}`, { messageId });
  const linkClasses = clsx(buttonStyles.button, buttonStyles.primary, buttonStyles.small);

  return (
    <div className={styles.message}>
      <pre className={styles.pre}>{getPreformattedText(message)}</pre>
      <div className={styles.actions}>
        <Link to={pathTo} className={linkClasses}>
          <img className={clsx(buttonStyles.icon, styles.replyLinkIcon)} src={messageSVG} alt="send reply icon" />
          Send reply
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
