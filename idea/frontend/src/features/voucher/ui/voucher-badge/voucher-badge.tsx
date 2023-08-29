import { HexString } from '@gear-js/api';

import { useIsVoucherExists } from '../../hooks';
import { ReactComponent as BadgeSVG } from '../../assets/badge.svg';
import styles from './voucher-badge.module.scss';

type Props = {
  programId: HexString;
};

const VoucherBadge = ({ programId }: Props) => {
  const { isVoucherExists } = useIsVoucherExists(programId);

  return isVoucherExists ? <BadgeSVG className={styles.badge} /> : null;
};

export { VoucherBadge };
