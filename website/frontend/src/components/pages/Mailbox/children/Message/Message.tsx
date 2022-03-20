import React from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useApi } from 'hooks/useApi';
import { RootState } from 'store/reducers';
import { Button } from 'common/components/Button/Button';
import { AddAlert } from 'store/actions/actions';
import { getPreformattedText } from 'helpers';
import { EventTypes } from 'types/alerts';
import { MessageType } from '../../types';
import MessageIcon from 'assets/images/message.svg';
import ClaimIcon from './images/claim.svg';
import styles from './Message.module.scss';

type Props = {
  message: MessageType;
};

const Message = ({ message }: Props) => {
  const [api] = useApi();
  const dispatch = useDispatch();
  const currentAccount = useSelector((state: RootState) => state.account.account);

  const showError = (error: string) => {
    dispatch(
      AddAlert({
        type: EventTypes.ERROR,
        message: error,
      })
    );
  };

  const handleClaimValue = () => {
    if (currentAccount) {
      api.claimValueFromMailbox.submit(message.id);

      web3FromSource(currentAccount.meta.source)
        .then((injector: any) => {
          api.claimValueFromMailbox.signAndSend(currentAccount.address, { signer: injector.signer }, (data: any) => {
            dispatch(AddAlert({ type: EventTypes.SUCCESS, message: `Status: ${data.status}` }));
          });
        })
        .catch(showError);
    } else {
      showError('Wallet not connected');
    }
  };

  return (
    <div className={styles.container}>
      <pre className={styles.message}>{getPreformattedText(message)}</pre>
      <div className={styles.buttons}>
        <Link to={`/send/reply/${message.id}`} className={styles.link}>
          <img className={styles.icon} src={MessageIcon} alt="send reply icon" />
          <span>Send reply</span>
        </Link>
        <Button text="Claim value" icon={ClaimIcon} color="main" size="small" onClick={handleClaimValue} />
      </div>
    </div>
  );
};

export default Message;
