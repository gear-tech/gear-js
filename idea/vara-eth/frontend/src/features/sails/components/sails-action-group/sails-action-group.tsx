import { useState } from 'react';
import type { Sails } from 'sails-js';

import ArrowSVG from '@/assets/icons/arrow-square-down.svg?react';
import { Badge } from '@/components';
import { cx } from '@/shared/utils';

import { SailsAction as SailsActionType } from '../../lib';
import { SailsAction } from '../sails-action';

import styles from './sails-action-group.module.scss';

type Props = {
  name: string;
  sails: Sails;
  items: SailsActionType[];
};

const SailsActionGroup = ({ name, sails, items }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const count = items.length;

  const renderItems = () => items.map((item) => <SailsAction key={item.id} sails={sails} {...item} />);

  return (
    // TODO: ExpandableItem component? it's not flexible though
    <div className={styles.container}>
      <button type="button" className={styles.header} onClick={() => setIsOpen((prevValue) => !prevValue)}>
        <ArrowSVG className={cx(styles.arrow, isOpen && styles.open)} />
        <span className={styles.title}>{name}</span>

        <Badge color="secondary">
          {count} {count === 1 ? 'Function' : 'Functions'}
        </Badge>
      </button>

      {isOpen && <div className={styles.body}>{renderItems()}</div>}
    </div>
  );
};

export { SailsActionGroup };
