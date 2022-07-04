import styles from './DotButton.module.scss';

import { NODE_API_ADDRESS } from 'context/api/const';
import dotSVG from 'assets/images/dot-logo.svg';

const DotButton = () => {
  const query = `?rpc=${NODE_API_ADDRESS}#`;
  const href = `https://polkadot.js.org/apps/${query}/explorer`;

  return (
    <a href={href} target="_blank" rel="noreferrer" className={styles.button}>
      <img src={dotSVG} alt="logo" className={styles.icon} />
      Polkadot Explorer
    </a>
  );
};

export { DotButton };
