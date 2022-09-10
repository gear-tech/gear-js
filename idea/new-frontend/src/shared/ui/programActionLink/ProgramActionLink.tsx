import { Link, LinkProps } from 'react-router-dom';
import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';

import styles from './ProgramActionLink.module.scss';

type Props = LinkProps & {
  icon: string;
  text: string;
};

const ProgramActionLink = ({ to, icon, text, className }: Props) => {
  const linkClasses = clsx(buttonStyles.button, buttonStyles.small, buttonStyles.transparent, styles.link, className);

  return (
    <Link to={to} className={linkClasses}>
      <img src={icon} alt={text} className={buttonStyles.icon} />
      <span className={styles.linkText}>{text}</span>
    </Link>
  );
};

export { ProgramActionLink };
