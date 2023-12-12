import { HexString } from '@gear-js/api';
import { useIsAccountVoucherExists } from '@gear-js/react-hooks';

import { withAccount } from '@/shared/ui';

import BadgeSVG from '../../assets/badge.svg?react';
import styles from './voucher-badge.module.scss';

type Props = {
  programId: HexString;
};

const VoucherBadge = withAccount(({ programId }: Props) => {
  const { isVoucherExists } = useIsAccountVoucherExists(programId);

  return isVoucherExists ? <BadgeSVG className={styles.badge} /> : null;
});

export { VoucherBadge };
