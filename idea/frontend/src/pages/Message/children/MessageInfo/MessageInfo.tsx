import { useState } from 'react';
import { Link, generatePath } from 'react-router-dom';
import clsx from 'clsx';
import { Hex } from '@gear-js/api';
import { Button, buttonStyles } from '@gear-js/ui';

import { routes } from 'routes';
import { useMessageClaim } from 'hooks';
import { formatDate } from 'helpers';
import { MessageModel } from 'types/message';
import { Spinner } from 'components/common/Spinner/Spinner';
import { FormText, formStyles } from 'components/common/Form';
import claimSVG from 'assets/images/claim.svg';
import messageSVG from 'assets/images/message.svg';

type Props = {
  message: MessageModel;
  payload: string;
};

const MessageInfo = ({ message, payload }: Props) => {
  const { id, source, value, expiration, destination, timestamp } = message;

  const [isLoading, setIsLoading] = useState(false);

  const claimMessage = useMessageClaim();

  const disableLoading = () => setIsLoading(false);

  const handleClaim = () => {
    setIsLoading(true);

    claimMessage({ messageId: id as Hex, reject: disableLoading, resolve: disableLoading });
  };

  const pathTo = generatePath(`${routes.send}/${routes.reply}`, { messageId: id });
  const linkClasses = clsx(buttonStyles.button, buttonStyles.primary, buttonStyles.normal);

  return (
    <div className={formStyles.largeForm}>
      <FormText label="Message Id" text={id} />

      <FormText label="Source" text={source} />

      <FormText label="Value" text={value} />

      <FormText label="Destination" text={destination} />

      <FormText label="Timestamp" text={formatDate(timestamp)} />

      {payload ? <FormText label="Payload" text={payload} isTextarea /> : <Spinner />}

      {expiration !== null && (
        <div className={formStyles.formButtons}>
          <Link to={pathTo} className={linkClasses}>
            <img className={buttonStyles.icon} src={messageSVG} alt="send reply icon" />
            Send reply
          </Link>
          <Button icon={claimSVG} text="Claim value" color="secondary" disabled={isLoading} onClick={handleClaim} />
        </div>
      )}
    </div>
  );
};

export { MessageInfo };
