import { Hex } from '@gear-js/api';
import { Button, buttonStyles, Input, Textarea } from '@gear-js/ui';
import { useState } from 'react';
import clsx from 'clsx';

import { ReactComponent as sendSVG } from 'shared/assets/images/actions/send.svg';
import { ReactComponent as testBalanceSVG } from 'shared/assets/images/actions/testBalance.svg';
import { ReactComponent as letterSVG } from 'shared/assets/images/actions/letter.svg';
import { ReactComponent as ArrowSVG } from 'shared/assets/images/actions/arrowRight.svg';
import { getPreformattedText } from 'shared/helpers';

import { UILink } from 'shared/ui/uiLink';
import { generatePath } from 'react-router-dom';
import { absoluteRoutes } from 'shared/config';
import styles from './Message.module.scss';
import { FormattedMailboxItem } from '../../model';

type Props = {
  value: FormattedMailboxItem;
  onClaim: (messageId: Hex, reject: () => void) => void;
};

const Message = ({ value, onClaim }: Props) => {
  const [message, interval] = value;

  const { id, source, destination, payload, reply } = message;
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
            <Textarea label="Reply" gap="1/5" value={getPreformattedText(reply)} rows={4} block readOnly />
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
          to={generatePath(absoluteRoutes.message, { messageId: id })}
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
