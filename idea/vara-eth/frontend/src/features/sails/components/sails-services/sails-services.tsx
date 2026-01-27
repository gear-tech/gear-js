import { useMemo } from 'react';
import { Sails } from 'sails-js';

import { Badge } from '@/components';
import { cx } from '@/shared/utils';

import styles from './sails-services.module.scss';

type Props = {
  value: Sails['services'];
};

const createRandomColorIndexGenerator = (size = 10) => {
  let pool: number[] = [];

  const fisherYatesShuffle = () => {
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  };

  return () => {
    if (!pool.length) {
      pool = Array.from({ length: size }, (_, i) => i);

      fisherYatesShuffle();
    }

    return pool.pop()!;
  };
};

const SailsServices = ({ value }: Props) => {
  const badges = useMemo(() => {
    const getColorIndex = createRandomColorIndexGenerator();
    const serviceNames = Object.keys(value);

    return serviceNames.map((service) => (
      <Badge key={service} className={cx(styles.badge, styles[`c${getColorIndex()}`])}>
        {service}
      </Badge>
    ));
  }, [value]);

  return badges.length ? <div className={styles.container}>{badges}</div> : <p>No services found.</p>;
};

export { SailsServices };
