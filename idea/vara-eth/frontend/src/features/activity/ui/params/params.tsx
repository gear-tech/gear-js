import { CopyButton } from '@/components';

import styles from './params.module.scss';

type Props = {
  params: Record<string, unknown> | readonly unknown[];
};

const Params = ({ params }: Props) => {
  return (
    <div className={styles.params}>
      {Object.entries(params).map(([key, value]) => {
        const formattedValue = value === Object(value) ? JSON.stringify(value) : String(value);

        return (
          <div className={styles.param} key={key}>
            {!Array.isArray(params) && `${key}:`} {formattedValue} <CopyButton value={formattedValue} />
          </div>
        );
      })}
    </div>
  );
};

export { Params };
