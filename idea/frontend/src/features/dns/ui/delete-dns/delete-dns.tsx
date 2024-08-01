import { Button } from '@gear-js/ui';

import { useModalState } from '@/hooks';
import TrashSVG from '@/shared/assets/images/actions/trashOutlined.svg?react';
import { ConfirmModal } from '@/shared/ui/confirm-modal';

import { FUNCTION_NAME } from '../../consts';
import { useSendDnsTransaction } from '../../hooks';
import styles from './delete-dns.module.scss';

type Props = {
  name: string;
  onSuccess: () => void;
};

const DeleteDns = ({ name, onSuccess }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModalState();
  const { isLoading, sendTransaction } = useSendDnsTransaction(FUNCTION_NAME.DELETE_PROGRAM);

  const onConfirm = () => {
    const _onSuccess = () => {
      onSuccess();
      closeModal();
    };

    sendTransaction([name], _onSuccess);
  };

  return (
    <>
      <Button icon={TrashSVG} size="large" color="transparent" className={styles.link} onClick={openModal} noWrap />

      {isModalOpen && (
        <ConfirmModal
          close={closeModal}
          onSubmit={onConfirm}
          title="Delete DNS"
          text={`DNS '${name}' will be deleted. Are you sure?`}
          confirmText="Delete"
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export { DeleteDns };
