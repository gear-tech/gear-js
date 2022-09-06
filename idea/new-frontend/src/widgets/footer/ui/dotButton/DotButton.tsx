import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';

import dotSVG from 'shared/assets/images/logos/dotLogo.svg';

import styles from './DotButton.module.scss';

type Props = {
  nodeAddress: string;
};

const DotButton = ({ nodeAddress }: Props) => {
  const linkClasses = clsx(buttonStyles.button, buttonStyles.transparent, buttonStyles.normal, styles.link);

  return (
    <a
      rel="noreferrer"
      href={`https://polkadot.js.org/apps/?rpc=${nodeAddress}#/explorer`}
      target="_blank"
      className={linkClasses}>
      <img src={dotSVG} alt="logo" className={clsx(buttonStyles.icon, styles.icon)} />
      Polkadot Explorer
    </a>
  );
};

export { DotButton };
