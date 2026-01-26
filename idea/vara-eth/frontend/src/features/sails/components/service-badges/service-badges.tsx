import { useMemo, useRef } from 'react';
import { Sails } from 'sails-js';

import { Badge } from '@/components';
import { cx } from '@/shared/utils';

import styles from './service-badges.module.scss';

type Props = {
  sails: Sails | undefined;
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

const ServiceBadges = ({ sails }: Props) => {
  const getColorIndex = useRef(createRandomColorIndexGenerator());

  const services = sails ? Object.keys(sails.services) : [];

  const badges = useMemo(
    () =>
      services.map((service) => (
        <Badge key={service} className={cx(styles.badge, styles[`c${getColorIndex.current()}`])}>
          {service}
        </Badge>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sails],
  );

  return services.length ? <div className={styles.container}>{badges}</div> : <p>No services found.</p>;
};

export { ServiceBadges };
