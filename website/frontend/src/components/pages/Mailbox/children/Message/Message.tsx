import React from 'react';
import { QueuedMessage } from '@gear-js/api';
import { ISubmittableResult } from '@polkadot/types/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useSelector, useDispatch } from 'react-redux';
import { useApi } from 'hooks/useApi';
import { RootState } from 'store/reducers';
import { Button } from 'common/components/Button/Button';
import { AddAlert } from 'store/actions/actions';
import { getPreformattedText } from 'helpers';
import { EventTypes } from 'types/alerts';
import claimIcon from './images/claim.svg';
import { Reply } from './children';
import styles from './Message.module.scss';

type Props = {
  message: QueuedMessage;
};

const Message = ({ message }: Props) => {
  const [api] = useApi();
  const dispatch = useDispatch();
  const { account } = useSelector((state: RootState) => state.account);
  const id = message.id.toHex();

  const showErrorAlert = (error: string) => {
    dispatch(AddAlert({ type: EventTypes.ERROR, message: error }));
  };

  const showSuccessAlert = (data: ISubmittableResult) => {
    dispatch(AddAlert({ type: EventTypes.SUCCESS, message: `Status: ${data.status}` }));
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
        <Reply to={id} />
        <Button text="Claim value" icon={claimIcon} color="main" size="small" onClick={handleClaimButtonClick} />
      </div>
    </div>
  );
};

export { Message };
