import { Button } from '@gear-js/ui';

import { useModalState } from '@/hooks';
import TrashSVG from '@/shared/assets/images/actions/trash.svg?react';

import { ConfirmModal } from '../confirn-modal';
import { useDnsActions } from '../../hooks/use-dns-actions';
import styles from './delete-dns.module.scss';

type Props = {
  name: string;
  onSuccess: () => void;
};

const DeleteDns = ({ name, onSuccess }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModalState();
  const { isLoading, deleteProgram } = useDnsActions();
  const text = `DNS '${name}' will be deleted. Are you sure?`;

  const onConfirm = async () => {
    const resolve = () => {
      onSuccess();
      closeModal();
    };
    deleteProgram(name, { resolve });
  };

  return (
    <>
      <Button
        icon={TrashSVG}
        text="Delete DNS"
        size="medium"
        color="transparent"
        className={styles.link}
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
};

export { DeleteDns };
