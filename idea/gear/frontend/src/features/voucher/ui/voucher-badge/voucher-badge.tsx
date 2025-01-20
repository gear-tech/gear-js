import { HexString } from '@gear-js/api';
import { useIsAnyAccountVoucherActive } from '@gear-js/react-hooks';
import clsx from 'clsx';

import BadgeSVG from '../../assets/badge.svg?react';
import styles from './voucher-badge.module.scss';

type Props = {
  programId: HexString;
};

const VoucherBadge = ({ programId }: Props) => {
  // TODO: take a look at performance, useVouchers is called for each program in a list
  const { isAnyVoucherActive, isAnyVoucherActiveReady } = useIsAnyAccountVoucherActive(programId);

  return isAnyVoucherActiveReady ? (
    <BadgeSVG className={clsx(styles.badge, !isAnyVoucherActive && styles.expired)} />
  ) : null;
};

export { VoucherBadge };
