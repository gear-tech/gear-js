import { Button } from '@gear-js/ui';

import { useModalState } from '@/hooks';
import EditSVG from '@/shared/assets/images/actions/edit.svg?react';

import { Voucher } from '../../api';
import { UpdateVoucherModal } from '../update-voucher-modal';

import styles from './update-voucher.module.scss';

type Props = {
  voucher: Voucher;
  onSubmit: () => void;
};

const UpdateVoucher = ({ voucher, onSubmit }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModalState();

  return (
    <>
      <Button icon={EditSVG} color="transparent" className={styles.link} onClick={openModal} noWrap />

      {isModalOpen && <UpdateVoucherModal voucher={voucher} close={closeModal} onSubmit={onSubmit} />}
    </>
  );
};

export { UpdateVoucher };
