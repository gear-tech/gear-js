import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui/dist/esm';

import dotSVG from 'shared/assets/images/logos/dotLogo.svg';

import styles from './DotButton.module.scss';
import { DOT_HREF } from '../../model/consts';

const DotButton = () => {
  const linkClasses = clsx(buttonStyles.button, buttonStyles.transparent, buttonStyles.normal, styles.link);

  return (
    <a href={DOT_HREF} target="_blank" rel="noreferrer" className={linkClasses}>
      <img src={dotSVG} alt="logo" className={clsx(buttonStyles.icon, styles.icon)} />
      Polkadot Explorer
    </a>
  );
};

export { DotButton };
