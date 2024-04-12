import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/ui';

import EditSVG from '../../assets/edit.svg?react';
import { IssueVoucherModal } from '../issue-voucher-modal';
import { useModal } from '../../hooks';
import styles from './update-voucher.module.scss';

type Props = {
  programId?: HexString;
  buttonSize?: 'small' | 'medium';
  buttonColor?: 'secondary' | 'light' | 'transparent';
  onSubmit?: () => void;
};

const UpdateVoucher = ({ programId, onSubmit }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModal();

  return (
    <>
      <Button icon={EditSVG} color="transparent" className={styles.link} onClick={openModal} noWrap />

      {isModalOpen && <IssueVoucherModal programId={programId} close={closeModal} onSubmit={onSubmit} />}
    </>
  );
};

export { UpdateVoucher };
