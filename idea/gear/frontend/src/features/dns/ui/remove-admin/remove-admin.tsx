import { HexString } from '@gear-js/api';
import { getVaraAddress } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { useModalState } from '@/hooks';
import TrashSVG from '@/shared/assets/images/actions/trashOutlined.svg?react';
import { ConfirmModal } from '@/shared/ui';

import { FUNCTION_NAME } from '../../consts';
import { useSendDnsTransaction } from '../../hooks';
import { getShortName } from '@/shared/helpers';

type Props = {
  name: string;
  address: HexString;
  onSuccess: () => void;
};

function RemoveAdmin({ name, address, onSuccess }: Props) {
  const [isModalOpen, openModal, closeModal] = useModalState();

  const { sendTransaction, isLoading } = useSendDnsTransaction(FUNCTION_NAME.REMOVE_ADMIN);

  const handleSubmit = () => {
    const _onSuccess = () => {
      closeModal();
      onSuccess();
    };

    sendTransaction([name, address], _onSuccess);
  };

  return (
    <>
      <Button icon={TrashSVG} color="transparent" onClick={openModal} />

      {isModalOpen && (
        <ConfirmModal
          title="Remove Admin"
          text={`Admin with address ${getShortName(
            getVaraAddress(address),
            16,
          )} will be removed. Would you like to proceed?`}
          onSubmit={handleSubmit}
          close={closeModal}
          isLoading={isLoading}
        />
      )}
    </>
  );
}

export { RemoveAdmin };
