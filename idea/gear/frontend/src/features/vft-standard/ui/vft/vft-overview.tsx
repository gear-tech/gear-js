import { HexString } from '@gear-js/api';
import { useProgramQuery } from '@gear-js/react-hooks';

import { Box } from '@/shared/ui';

import { useVftProgram } from '../../hooks';

import { VftActions, VftReads } from './vft-actions';
import styles from './vft-overview.module.scss';

type Props = {
  id: HexString | undefined;
};

function VftOverview({ id }: Props) {
  const { data: program } = useVftProgram(id);

  const name = useProgramQuery({ program, serviceName: 'vft', functionName: 'name', args: [] });
  const symbol = useProgramQuery({ program, serviceName: 'vft', functionName: 'symbol', args: [] });
  const totalSupply = useProgramQuery({ program, serviceName: 'vft', functionName: 'totalSupply', args: [] });
  const decimals = useProgramQuery({ program, serviceName: 'vft', functionName: 'decimals', args: [] });

  return (
    <Box className={styles.overview}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{name.data}</h3>
          <span className={styles.symbol}>{symbol.data}</span>
        </div>

        <div className={styles.actions}>
          <VftActions />
          <VftReads />
        </div>
      </header>

      <div className={styles.info}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Total Supply:</span>
          <span className={styles.value}>{totalSupply.data}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Decimals:</span>
          <span className={styles.value}>{decimals.data}</span>
        </div>
      </div>
    </Box>
  );
}

export { VftOverview };
