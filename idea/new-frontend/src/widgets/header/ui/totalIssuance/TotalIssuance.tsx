import styles from './TotalIssuance.module.scss';
import headerStyles from '../Header.module.scss';

type Props = {
  totalIssuance: string;
};

const TotalIssuance = ({ totalIssuance }: Props) => (
  <section className={styles.totalIssuance}>
    <h2 className={headerStyles.title}>Total issuance</h2>
    <p className={headerStyles.content}>
      <span className={headerStyles.value}>{totalIssuance}</span>
      <span>MUnit</span>
    </p>
  </section>
);

export { TotalIssuance };
