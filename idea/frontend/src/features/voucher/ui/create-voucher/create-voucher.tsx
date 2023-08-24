import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/ui';

import actionLinkStyles from 'shared/ui/ActionLink/ActionLink.module.scss';

import { ReactComponent as CouponSVG } from '../../assets/coupon.svg';
import styles from './CreateVoucher.module.scss';

type Props = {
  programId: HexString;
};

const CreateVoucher = ({ programId }: Props) => {
  console.log();

  return (
    <Button
      icon={CouponSVG}
      text="Create Voucher"
      color="transparent"
      size="small"
      className={actionLinkStyles.link}
      noWrap
    />
  );
};

export { CreateVoucher };
