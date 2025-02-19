import { buttonStyles } from '@gear-js/ui';
import clsx from 'clsx';
import { FunctionComponent, SVGProps } from 'react';
import { Link, LinkProps } from 'react-router-dom';

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
    <Link to={to} className={linkClasses} state={state}>
      <Icon className={buttonStyles.icon} />

      {text}
    </Link>
  );
};

export { ActionLink };
