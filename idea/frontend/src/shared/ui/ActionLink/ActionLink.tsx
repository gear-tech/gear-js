import { Link, LinkProps } from 'react-router-dom';
import { FunctionComponent, SVGProps } from 'react';
import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';

import styles from './ActionLink.module.scss';

type Props = LinkProps & {
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  text: string;
};

const ActionLink = ({ to, icon: Icon, text, className, state }: Props) => {
  const linkClasses = clsx(buttonStyles.button, buttonStyles.small, buttonStyles.transparent, styles.link, className);

  return (
    <Link to={to} className={linkClasses} state={state}>
      <Icon className={buttonStyles.icon} />
      <span className={styles.linkText}>{text}</span>
    </Link>
  );
};

export { ActionLink };
