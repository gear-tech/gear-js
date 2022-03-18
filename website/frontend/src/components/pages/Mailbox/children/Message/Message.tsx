import React, { FC } from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useApi } from 'hooks/useApi';
import { RootState } from 'store/reducers';
import MessageIcon from 'assets/images/message.svg';
import ClaimIcon from 'assets/images/claim.svg';
import { AddAlert } from 'store/actions/actions';
import { getPreformattedText } from 'helpers';
import { EventTypes } from 'types/alerts';
import { MessageType } from '../../types';
import styles from './Message.module.scss';

type Props = {
  elem: MessageType;
};

export const Message: FC<Props> = ({ elem }) => {
  const [api] = useApi();
  const dispatch = useDispatch();
  const currentAccount = useSelector((state: RootState) => state.account.account);

  const handleClaimValue = async () => {
    if (currentAccount) {
      try {
        const injector = await web3FromSource(currentAccount.meta.source);

        await api.claimValueFromMailbox.submit(elem.id);
        await api.claimValueFromMailbox.signAndSend(
          currentAccount.address,
          { signer: injector.signer },
          (data: any) => {
            dispatch(AddAlert({ type: EventTypes.SUCCESS, message: `Status: ${data.status}` }));
          }
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      dispatch(AddAlert({ type: EventTypes.ERROR, message: `Wallet not connected` }));
    }
  };

  return (
    <div className={styles.mailItem}>
      <pre className={styles.body}>{getPreformattedText(elem)}</pre>
      <div className={styles.buttons}>
        <Link to={`/send/reply/${elem.id}`} className={styles.button}>
          <img className={styles.image} src={MessageIcon} alt="send reply icon" />
          <span className={styles.buttonText}>Send reply</span>
        </Link>
        <button className={styles.button} onClick={handleClaimValue}>
          <img className={styles.image} src={ClaimIcon} alt="send reply icon" />
          <span className={styles.buttonText}>Claim value</span>
        </button>
      </div>
    </div>
  );
};
