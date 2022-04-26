import React from 'react';
import { useAlert } from 'react-alert';
import { HumanedMessage } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { ISubmittableResult } from '@polkadot/types/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useApi, useAccount } from 'hooks';
import { getPreformattedText } from 'helpers';
import claimIcon from './images/claim.svg';
import { ReplyLink } from './children';
import styles from './Message.module.scss';

type Props = {
  message: HumanedMessage;
};

const Message = ({ message }: Props) => {
  const { id } = message;

  const { api } = useApi();
  const { account } = useAccount();
  const alert = useAlert();

  const showErrorAlert = (error: string) => {
    alert.error(error);
  };

  const showSuccessAlert = (data: ISubmittableResult) => {
    if (!data.status.isBroadcast) {
      alert.success(`Status: ${data.status}`);
    }
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
      <pre className={styles.pre}>{getPreformattedText(message)}</pre>
      <div>
        <ReplyLink to={id} />
        <Button text="Claim value" icon={claimIcon} color="secondary" size="small" onClick={handleClaimButtonClick} />
      </div>
    </div>
  );
};

export { Message };
