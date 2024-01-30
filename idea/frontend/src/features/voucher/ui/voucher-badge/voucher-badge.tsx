import { HexString } from '@gear-js/api';
import { useAccountVouchers } from '@gear-js/react-hooks';

import { withAccount, withDeprecatedFallback } from '@/shared/ui';

import BadgeSVG from '../../assets/badge.svg?react';
import { VoucherBadgeDeprecated } from './voucher-badge-deprecated';
import styles from './voucher-badge.module.scss';

type Props = {
  programId: HexString;
};

const VoucherBadge = withAccount(
  withDeprecatedFallback(({ programId }: Props) => {
    const { vouchers } = useAccountVouchers(programId);
    const voucherEntries = Object.entries(vouchers || {});
    const vouchersCount = voucherEntries.length;

    return vouchersCount ? <BadgeSVG className={styles.badge} /> : null;
  }, VoucherBadgeDeprecated),
);

export { VoucherBadge };
