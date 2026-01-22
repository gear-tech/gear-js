import { PropsWithChildren, useState } from 'react';
import { Sails } from 'sails-js';

import ArrowSVG from '@/assets/icons/arrow-square-down.svg?react';
import { Badge } from '@/components';
import { cx } from '@/shared/utils';

import styles from './sails-service.module.scss';

type Services = InstanceType<typeof Sails>['services'];
type SailsService = Services[string];

type Props = PropsWithChildren & {
  name: string;
  counter: number;
};

const SailsService = ({ name, counter, children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button className={styles.header} onClick={() => setIsOpen((prevValue) => !prevValue)}>
        <ArrowSVG className={cx(styles.arrow, isOpen && styles.open)} />
        <span className={styles.title}>{name}</span>

        <Badge color="secondary">
          {counter} {counter === 1 ? 'Function' : 'Functions'}
        </Badge>
      </button>

      {isOpen && <div className={styles.body}>{children}</div>}
    </div>
  );
};

export { SailsService };
