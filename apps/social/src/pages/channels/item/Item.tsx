import { useAccount } from '@gear-js/react-hooks';
import { toShortAddress } from 'utils'
import { Hex } from '@gear-js/api';
import { buttonStyles } from '@gear-js/ui';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import styles from './Item.module.scss';

type Props = {
  id: Hex;
  name: string;
  ownerId: Hex;
};

function Item({ id, name, ownerId }: Props) {
  const { account } = useAccount();
  const isOwner = account?.decodedAddress === ownerId;

  const to = `/channel/${id}`;

  return (
    <div className={styles.item}>
      <i className={styles.tower} />
      <div className={styles.info}>{name}</div>
      <div className={styles.address}>{toShortAddress(id)}</div>
      <NavLink to={to} className={clsx(buttonStyles.button, buttonStyles.small, isOwner ? buttonStyles.secondary : buttonStyles.primary)}>
        {isOwner? 'To my channel' : 'Go to'}
      </NavLink>
    </div>
  );
}

export { Item };
