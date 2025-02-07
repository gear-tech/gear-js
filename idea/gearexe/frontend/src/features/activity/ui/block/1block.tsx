import { formatDate, formatNumber } from '@/shared/utils';
import { HashLink } from '@/components';
import styles from './Block.module.scss';

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
