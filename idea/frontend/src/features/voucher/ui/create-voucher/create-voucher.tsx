import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { useState } from 'react';

import actionLinkStyles from 'shared/ui/ActionLink/ActionLink.module.scss';

import { ReactComponent as CouponSVG } from '../../assets/coupon.svg';
import { CreateVoucherModal } from '../create-voucher-modal';

type Props = {
  programId: HexString;
};

const CreateVoucher = ({ programId }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button
        icon={CouponSVG}
        text="Create Voucher"
        color="transparent"
        size="small"
        className={actionLinkStyles.link}
        noWrap
        onClick={openModal}
      />

      {isModalOpen && <CreateVoucherModal programId={programId} close={closeModal} />}
    </>
  );
};

export { CreateVoucher };
