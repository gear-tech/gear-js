import { formatDate, formatNumber } from '@/shared/utils';
import styles from './Block.module.scss';
import { HashLink } from '@/components/ui/hashLink/HashLink';

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
