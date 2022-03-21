import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Hex } from '@gear-js/api';
import messageIcon from 'assets/images/message.svg';
import buttonStyles from 'common/components/Button/Button.module.scss';
import styles from './ReplyLink.module.scss';

type Props = {
  to: Hex;
};

const ReplyLink = ({ to }: Props) => {
  const linkClassName = clsx(buttonStyles.button, buttonStyles.small, buttonStyles.success, styles.link);
  const iconClassName = clsx(buttonStyles.icon, styles.icon);

  return (
    <Link to={`/send/reply/${to}`} className={linkClassName}>
      <img className={iconClassName} src={messageIcon} alt="send reply icon" />
      Send reply
    </Link>
  );
};

export { ReplyLink };
