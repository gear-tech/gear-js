import dotSVG from 'shared/assets/images/logos/dotLogo.svg';

import styles from './DotButton.module.scss';

type Props = {
  nodeAddress: string;
};

const DotButton = ({ nodeAddress }: Props) => (
  <a
    rel="noreferrer"
    href={`https://polkadot.js.org/apps/?rpc=${nodeAddress}#/explorer`}
    target="_blank"
    className={styles.link}>
    <img src={dotSVG} alt="logo" className={styles.icon} />
    Polkadot Explorer
  </a>
);

export { DotButton };
