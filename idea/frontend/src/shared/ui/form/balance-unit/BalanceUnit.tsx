import { useApi } from '@gear-js/react-hooks';
import styles from './BalanceUnit.module.scss';

const BalanceUnit = () => {
  const { api } = useApi();
  const [unit] = api.registry.chainTokens;

  return <span className={styles.unit}>{unit}</span>;
};

export { BalanceUnit };
