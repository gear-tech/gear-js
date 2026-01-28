import { Sails } from 'sails-js';

import { Badge } from '@/components';
import { cx } from '@/shared/utils';

import styles from './sails-services.module.scss';

type Props = {
  value: Sails['services'];
};

const getHash = (value: string) => {
  let hash = 0;

  for (const char of value) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }

  return hash >>> 0;
};

const COLOR_COUNT = 10;

const SailsServices = ({ value }: Props) => {
  const services = Object.keys(value);

  const render = () =>
    services.map((service) => {
      const colorIndex = getHash(service) % COLOR_COUNT;

      return (
        <Badge key={service} className={cx(styles.badge, styles[`c${colorIndex}`])}>
          {service}
        </Badge>
      );
    });

  return services.length ? <div className={styles.container}>{render()}</div> : <p>No services found.</p>;
};

export { SailsServices };
