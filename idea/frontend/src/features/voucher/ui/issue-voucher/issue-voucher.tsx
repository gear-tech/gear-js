import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import cx from 'clsx';

import { withAccount } from '@/shared/ui';

import CouponSVG from '../../assets/coupon.svg?react';
import { IssueVoucherModal } from '../issue-voucher-modal';
import { useModal } from '../../hooks';
import styles from './issue-voucher.module.scss';

type Props = {
  programId?: HexString;
  buttonSize?: 'small' | 'medium';
  buttonColor?: 'secondary' | 'light' | 'transparent';
  onSubmit?: () => void;
};

const IssueVoucher = withAccount(({ programId, buttonColor = 'light', buttonSize = 'medium', onSubmit }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModal();

  return (
    <>
      <Button
        icon={CouponSVG}
        text="Create Voucher"
        size={buttonSize}
        color={buttonColor}
        className={cx(buttonColor === 'transparent' && styles.link)}
        onClick={openModal}
        noWrap
      />

      {isModalOpen && <IssueVoucherModal programId={programId} close={closeModal} onSubmit={onSubmit} />}
    </>
  );
});

export { IssueVoucher };
