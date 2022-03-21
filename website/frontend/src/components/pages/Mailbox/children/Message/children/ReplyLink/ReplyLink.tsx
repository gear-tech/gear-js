import React from 'react';
import { Hex } from '@gear-js/api';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import messageIcon from 'assets/images/message.svg';
import buttonStyles from 'common/components/Button/Button.module.scss';
import styles from './ReplyLink.module.scss';

type Props = {
  id: Hex;
};

const ReplyLink = ({ id }: Props) => {
  const linkClassName = clsx(buttonStyles.button, buttonStyles.small, buttonStyles.success, styles.link);
  const iconClassName = clsx(buttonStyles.icon, styles.icon);

  return (
    <Link to={`/send/reply/${id}`} className={linkClassName}>
      <img className={iconClassName} src={messageIcon} alt="send reply icon" />
      Send reply
    </Link>
  );
};

export { ReplyLink };
