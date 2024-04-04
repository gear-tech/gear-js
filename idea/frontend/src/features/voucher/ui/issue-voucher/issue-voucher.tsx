import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { useState } from 'react';
import cx from 'clsx';

import { withAccount } from '@/shared/ui';
import actionLinkStyles from '@/shared/ui/ActionLink/ActionLink.module.scss';

import CouponSVG from '../../assets/coupon.svg?react';
import { IssueVoucherModal } from '../issue-voucher-modal';

type Props = {
  programId?: HexString;
  buttonSize?: 'small' | 'medium';
  buttonColor?: 'secondary' | 'light' | 'transparent';
};

const IssueVoucher = withAccount(({ programId, buttonColor = 'light', buttonSize = 'medium' }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button
        icon={CouponSVG}
        text="Create Voucher"
        size={buttonSize}
        color={buttonColor}
        className={cx(buttonColor === 'transparent' && actionLinkStyles.link)}
        onClick={openModal}
        noWrap
      />

      {isModalOpen && <IssueVoucherModal programId={programId} close={closeModal} />}
    </>
  );
});

export { IssueVoucher };
