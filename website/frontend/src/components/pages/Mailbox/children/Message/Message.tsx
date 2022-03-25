import React from 'react';
import { useAlert } from 'react-alert';
import { QueuedMessage } from '@gear-js/api';
import { ISubmittableResult } from '@polkadot/types/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useApi, useAccount } from 'hooks';
import { Button } from 'common/components/Button/Button';
import { AlertTypes } from 'types/alerts';
import { getPreformattedText } from 'helpers';
import claimIcon from './images/claim.svg';
import { ReplyLink } from './children';
import styles from './Message.module.scss';

type Props = {
  message: QueuedMessage;
};

const Message = ({ message }: Props) => {
  const { api } = useApi();
  const { account } = useAccount();
  const alert = useAlert();

  const formattedMessage = message.toHuman();
  const id = message.id.toHex();

  const showErrorAlert = (error: string) => {
    alert.show(error, { type: AlertTypes.ERROR });
  };

  const showSuccessAlert = (data: ISubmittableResult) => {
    alert.show(`Status: ${data.status}`, { type: AlertTypes.SUCCESS });
  };

  const handleClaimButtonClick = () => {
    if (account) {
      const { address, meta } = account;

      api.claimValueFromMailbox.submit(id);
      web3FromSource(meta.source)
        .then(({ signer }) => api.claimValueFromMailbox.signAndSend(address, { signer }, showSuccessAlert))
        .catch((error: Error) => showErrorAlert(error.message));
    }
  };

  return (
    <div className={styles.message}>
      <pre className={styles.pre}>{getPreformattedText(formattedMessage)}</pre>
      <div>
        <ReplyLink to={id} />
        <Button text="Claim value" icon={claimIcon} color="secondary" size="small" onClick={handleClaimButtonClick} />
      </div>
    </div>
  );
};

export { Message };
