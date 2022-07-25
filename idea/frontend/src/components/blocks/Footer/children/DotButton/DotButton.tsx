import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';

import styles from './DotButton.module.scss';
import { DOT_HREF } from './const';

import dotSVG from 'assets/images/dot-logo.svg';

const DotButton = () => {
  const linkClasses = clsx(buttonStyles.button, buttonStyles.transparent, buttonStyles.normal);

  return (
    <a href={DOT_HREF} target="_blank" rel="noreferrer" className={linkClasses}>
      <img src={dotSVG} alt="logo" className={clsx(buttonStyles.icon, styles.icon)} />
      Polkadot Explorer
    </a>
  );
};

export { DotButton };
