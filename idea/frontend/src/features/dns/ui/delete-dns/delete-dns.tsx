import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import cx from 'clsx';

import { withAccount } from '@/shared/ui';

import DnsSVG from '../../assets/trash.svg?react';
import { useModal } from '../../hooks';
import { ConfirmModal } from '../confirn-modal';
import styles from './delete-dns.module.scss';
import { useDnsActions } from '../../sails';

type Props = {
  name: string;
  programId?: HexString;
  buttonSize?: 'small' | 'medium';
  buttonColor?: 'secondary' | 'light' | 'transparent';
  onSuccess?: () => void;
};

const DeleteDns = withAccount(({ buttonColor = 'transparent', buttonSize = 'medium', onSuccess, name }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModal();
  const { isLoading, deleteProgram } = useDnsActions();
  const text = `DNS '${name}' will be deleted. Are you sure?`;

  const onConfirm = async () => {
    const resolve = () => {
      onSuccess?.();
      closeModal();
    };
    deleteProgram(name, { resolve });
  };

  return (
    <>
      <Button
        icon={DnsSVG}
        text="Delete DNS"
        size={buttonSize}
        color={buttonColor}
        className={cx(buttonColor === 'transparent' && styles.link)}
        onClick={openModal}
        noWrap
      />
      {isModalOpen && (
        <ConfirmModal
          close={closeModal}
          onSubmit={onConfirm}
          title="Delete DNS"
          text={text}
          confirmText="Delete"
          isLoading={isLoading}
        />
      )}
    </>
  );
});

export { DeleteDns };
