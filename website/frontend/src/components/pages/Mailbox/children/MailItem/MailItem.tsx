import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useApi } from 'hooks/useApi';
import { RootState } from 'store/reducers';
import MessageIcon from 'assets/images/message.svg';
import ClaimIcon from 'assets/images/claim.svg';
import { AddAlert } from 'store/actions/actions';
import { getPreformattedText } from 'helpers';
import { claimValue } from 'components/pages/Mailbox/helpers';
import { EventTypes } from 'types/alerts';
import { Mail } from '../../types';
import styles from './MailItem.module.scss';

type Props = {
  elem: Mail;
};

export const MailItem: FC<Props> = ({ elem }) => {
  const [api] = useApi();
  const dispatch = useDispatch();
  const currentAccount = useSelector((state: RootState) => state.account.account);

  const handleClaim = async () => {
    if (currentAccount) {
      claimValue(api, currentAccount, elem, dispatch);
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
        <button className={styles.button} onClick={handleClaim}>
          <img className={styles.image} src={ClaimIcon} alt="send reply icon" />
          <span className={styles.buttonText}>Claim value</span>
        </button>
      </div>
    </div>
  );
};
