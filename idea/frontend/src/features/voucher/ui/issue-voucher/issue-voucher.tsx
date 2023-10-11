import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { useState } from 'react';
import cx from 'clsx';

import actionLinkStyles from '@/shared/ui/ActionLink/ActionLink.module.scss';

import CouponSVG from '../../assets/coupon.svg?react';
import { withAccount } from '../../hooks';
import { IssueVoucherModal } from '../issue-voucher-modal';

type Props = {
  programId: HexString;
  transparent?: boolean;
};

const IssueVoucher = withAccount(({ programId, transparent }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button
        icon={CouponSVG}
        text="Create Voucher"
        color={transparent ? 'transparent' : 'secondary'}
        size="small"
        className={cx(transparent && actionLinkStyles.link)}
        noWrap
        onClick={openModal}
      />

      {isModalOpen && <IssueVoucherModal programId={programId} close={closeModal} />}
    </>
  );
});

export { IssueVoucher };
