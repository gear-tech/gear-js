import { Tooltip } from '@gear-js/ui';

import styles from './TotalIssuance.module.scss';
import headerStyles from '../Header.module.scss';

type Props = {
  totalIssuance: string;
};

const TotalIssuance = ({ totalIssuance }: Props) => (
  <section>
    <h2 className={headerStyles.title}>Total issuance</h2>
    <div className={headerStyles.content}>
      <span className={headerStyles.value}>{totalIssuance}</span>
      <span>MUnit</span>
      <Tooltip text="Total issuance" className={styles.tooltip} />
    </div>
  </section>
);

export { TotalIssuance };
