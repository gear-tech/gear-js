import { Button, buttonStyles, Input } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { useState } from 'react';
import clsx from 'clsx';

import sendSVG from '@/shared/assets/images/actions/send.svg?react';
import testBalanceSVG from '@/shared/assets/images/actions/testBalance.svg?react';
import letterSVG from '@/shared/assets/images/actions/letter.svg?react';
import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';

import { MailboxItem } from '@/features/mailbox';
import { UILink } from '@/shared/ui/uiLink';
import { generatePath } from 'react-router-dom';
import { absoluteRoutes, routes } from '@/shared/config';
import styles from './Message.module.scss';

type Props = {
  value: MailboxItem;
  onClaim: (messageId: HexString, reject: () => void) => void;
};

const Message = ({ value, onClaim }: Props) => {
  const [message, interval] = value;

  const { id, source, destination, payload } = message;
  const { start, finish } = interval;

  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClaim = () => {
    setIsLoading(true);

    onClaim(id, () => setIsLoading(false));
  };

  const toggleExpansion = () => setIsExpanded((prevValue) => !prevValue);

  const inputsClassNames = clsx(styles.inputs, isExpanded && styles.expanded);

  const buttonClassNames = clsx(
    buttonStyles.button,
    buttonStyles.transparent,
    buttonStyles.block,
    styles.expandButton,
    isExpanded && styles.expanded,
  );

  return (
    <li className={styles.message}>
      <div className={inputsClassNames}>
        <Input label="ID" gap="1/5" value={id} readOnly block />
        <Input label="Source" gap="1/5" value={source} readOnly block />
        {isExpanded && (
          <>
            <Input label="Destination" gap="1/5" value={destination} readOnly block />
            <Input label="Payload" gap="1/5" value={payload} readOnly block />
            <Input label="Value" gap="1/5" value={message.value} block readOnly />
            <Input label="Start" gap="1/5" value={start} readOnly block />
            <Input label="Finish" gap="1/5" value={finish} readOnly block />
          </>
        )}
      </div>

      <div className={styles.buttons}>
        <UILink
          to={generatePath(absoluteRoutes.reply, { messageId: id })}
          text="Send reply"
          icon={sendSVG}
          color="transparent"
        />
        <UILink
          to={generatePath(routes.message, { messageId: id })}
          text="Go to message"
          icon={letterSVG}
          color="transparent"
        />
        <Button
          text="Claim value"
          icon={testBalanceSVG}
          color="transparent"
          onClick={handleClaim}
          disabled={isLoading}
        />
      </div>

      <button type="button" className={buttonClassNames} onClick={toggleExpansion}>
        {isExpanded ? 'Show less' : 'Show more'}
        <ArrowSVG />
      </button>
    </li>
  );
};

export { Message };
