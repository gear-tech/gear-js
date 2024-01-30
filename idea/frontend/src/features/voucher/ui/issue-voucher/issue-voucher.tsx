import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { useState } from 'react';
import cx from 'clsx';

import { withAccount } from '@/shared/ui';
import actionLinkStyles from '@/shared/ui/ActionLink/ActionLink.module.scss';

import CouponSVG from '../../assets/coupon.svg?react';
import { IssueVoucherModal, IssueVoucherModalDeprecated } from '../issue-voucher-modal';
import { useApi } from '@gear-js/react-hooks';

type Props = {
  programId: HexString;
  transparent?: boolean;
};

const IssueVoucher = withAccount(({ programId, transparent }: Props) => {
  const { isV110Runtime } = useApi();
  const Modal = isV110Runtime ? IssueVoucherModal : IssueVoucherModalDeprecated;

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

      {isModalOpen && <Modal programId={programId} close={closeModal} />}
    </>
  );
});

export { IssueVoucher };
