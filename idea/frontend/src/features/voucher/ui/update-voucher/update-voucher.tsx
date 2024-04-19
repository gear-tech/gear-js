import { Button } from '@gear-js/ui';

import EditSVG from '../../assets/edit.svg?react';
import { UpdateVoucherModal } from '../update-voucher-modal';
import { useModal } from '../../hooks';
import { Voucher } from '../../types';
import styles from './update-voucher.module.scss';

type Props = {
  voucher: Voucher;
  onSubmit: () => void;
};

const UpdateVoucher = ({ voucher, onSubmit }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModal();

  return (
    <>
      <Button icon={EditSVG} color="transparent" className={styles.link} onClick={openModal} noWrap />

      {isModalOpen && <UpdateVoucherModal voucher={voucher} close={closeModal} onSubmit={onSubmit} />}
    </>
  );
};

export { UpdateVoucher };
