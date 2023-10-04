import { useApi } from '@gear-js/react-hooks';
import styles from './BalanceUnit.module.scss';

const BalanceUnit = () => {
  const { api, isApiReady } = useApi();
  const [unit] = isApiReady ? api.registry.chainTokens : ['Unit'];

  return <span className={styles.unit}>{unit}</span>;
};

export { BalanceUnit };
