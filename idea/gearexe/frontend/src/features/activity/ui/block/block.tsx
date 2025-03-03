import { HashLink } from '@/components';
import { formatDate, formatNumber } from '@/shared/utils';

import styles from './block.module.scss';

type Props = {
  blockNumber: number;
  blockHash: string;
  date: number;
};

const Block = ({ blockNumber, blockHash, date }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Block #{formatNumber(blockNumber)}.
        <HashLink hash={blockHash} />
      </div>
      {formatDate(date)}
    </div>
  );
};

export { Block };
