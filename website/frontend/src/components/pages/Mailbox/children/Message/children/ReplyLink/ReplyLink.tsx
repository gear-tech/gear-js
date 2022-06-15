import { Link } from 'react-router-dom';
import { Hex } from '@gear-js/api';
import messageIcon from 'assets/images/message.svg';
import styles from './ReplyLink.module.scss';

type Props = {
  to: Hex;
};

const ReplyLink = ({ to }: Props) => (
  <Link to={`/send/reply/${to}`} className={styles.link}>
    <img className={styles.icon} src={messageIcon} alt="send reply icon" />
    Send reply
  </Link>
);

export { ReplyLink };
