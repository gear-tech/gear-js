import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import cx from 'clsx';

import { withAccount } from '@/shared/ui';

import DnsSVG from '../../assets/trash.svg?react';
import { useLoading, useModal } from '../../hooks';
import { ConfirmModal } from '../confirn-modal';
import styles from './delete-dns.module.scss';
import { DeleteProgram } from '../../sails';
import { useAccount, useAlert } from '@gear-js/react-hooks';

type Props = {
  name: string;
  programId?: HexString;
  buttonSize?: 'small' | 'medium';
  buttonColor?: 'secondary' | 'light' | 'transparent';
  onSubmit?: () => void;
};

const DeleteDns = withAccount(({ buttonColor = 'transparent', buttonSize = 'medium', onSubmit, name }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModal();
  const alert = useAlert();
  const [isLoading, enableLoading, disableLoading] = useLoading();
  const { account } = useAccount();
  const text = `DNS '${name}' will be deleted. Are you sure?`;

  const onConfirm = async () => {
    if (account) {
      try {
        enableLoading();
        await DeleteProgram(account, name);

        onSubmit?.();
        closeModal();
      } catch (error) {
        const errorMessage = (error as Error).message;
        alert.error(errorMessage);
      } finally {
        disableLoading();
      }
    }
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
