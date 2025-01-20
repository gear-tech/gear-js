import { buttonStyles } from '@gear-js/ui';
import { Link, LinkProps } from 'react-router-dom';
import { FunctionComponent, SVGProps } from 'react';
import clsx from 'clsx';

import styles from './ActionLink.module.scss';

type Props = LinkProps & {
  icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  text: string;
};

const ActionLink = ({ to, icon: Icon, text, state }: Props) => {
  const linkClasses = clsx(
    buttonStyles.button,
    buttonStyles.small,
    buttonStyles.transparent,
    buttonStyles.letterSpacing,
    buttonStyles.noWrap,
    styles.link,
  );

  return (
    <Link to={to} className={linkClasses} state={state}>
      <Icon className={buttonStyles.icon} />

      {text}
    </Link>
  );
};

export { ActionLink };
