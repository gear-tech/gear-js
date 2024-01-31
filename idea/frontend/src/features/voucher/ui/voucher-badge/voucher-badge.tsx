import { HexString } from '@gear-js/api';
import { useIsAnyAccountVoucherActive } from '@gear-js/react-hooks';
import clsx from 'clsx';

import { withDeprecatedFallback } from '@/shared/ui';

import BadgeSVG from '../../assets/badge.svg?react';
import { VoucherBadgeDeprecated } from './voucher-badge-deprecated';
import styles from './voucher-badge.module.scss';

type Props = {
  programId: HexString;
};

const VoucherBadge = withDeprecatedFallback(({ programId }: Props) => {
  // TODO: take a look at performance, useVouchers is called for each program in a list
  const { isAnyVoucherActive, isAnyVoucherActiveReady } = useIsAnyAccountVoucherActive(programId);

  return isAnyVoucherActiveReady ? (
    <BadgeSVG className={clsx(styles.badge, !isAnyVoucherActive && styles.expired)} />
  ) : null;
}, VoucherBadgeDeprecated);

export { VoucherBadge };
