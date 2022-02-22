import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from 'hooks/useApi';
import MessageIcon from 'assets/images/message.svg';
import ClaimIcon from 'assets/images/claim.svg';
import { getPreformattedText } from 'helpers';
import styles from './MailItem.module.scss';

type Props = {
  elem: any;
};

export const MailItem: FC<Props> = ({ elem }) => {
  const [api] = useApi();

  const handleClaim = async () => {
    const a = await api.claimValueFromMailbox.submit(elem.id);
    const b = a.toHuman();
    console.log(b);
  };

  return (
    <div className={styles.mailItem}>
      <pre className={styles.body}>{getPreformattedText(elem)}</pre>
      <div className={styles.buttons}>
        <Link to={`/reply-message/${elem.id}`} className={styles.button}>
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
