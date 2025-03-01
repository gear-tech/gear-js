import { CopyButton } from '@/components';

import styles from './params.module.scss';

type Props = {
  params: Record<string, string | number | bigint | boolean>;
};

const Params = ({ params }: Props) => {
  return (
    <div className={styles.params}>
      {Object.entries(params).map(([key, value]) => (
        <div className={styles.param} key={key}>
          {key}: {value} <CopyButton value={String(value)} />
        </div>
      ))}
    </div>
  );
};

export { Params };
