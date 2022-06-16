import dot from 'assets/images/dot-logo.svg';
import { nodeApi } from 'api/initApi';
import styles from './DotButton.module.scss';

const DotButton = () => {
  const query = `?rpc=${nodeApi.address}#`;
  const href = `https://polkadot.js.org/apps/${query}/explorer`;

  return (
    <a href={href} target="_blank" rel="noreferrer" className={styles.button}>
      <img src={dot} alt="logo" className={styles.icon} />
      Polkadot Explorer
    </a>
  );
};

export { DotButton };
