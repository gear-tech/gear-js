import { CopyButton } from '@/components';

import styles from './params.module.scss';

type Props = {
  params: Record<string, unknown>;
};

const Params = ({ params }: Props) => {
  return (
    <div className={styles.params}>
      {Object.entries(params).map(([key, value]) => {
        if (typeof value === 'object') {
          return (
            <div className={styles.param} key={key}>
              {key}: {JSON.stringify(value)} <CopyButton value={JSON.stringify(value)} />
            </div>
          );
        }

        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean' ||
          typeof value === 'bigint'
        ) {
          return (
            <div className={styles.param} key={key}>
              {key}: {value} <CopyButton value={String(value)} />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export { Params };
