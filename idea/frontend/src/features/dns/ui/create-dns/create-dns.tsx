import { Button } from '@gear-js/ui';

import { useModalState } from '@/hooks';
import { withAccount } from '@/shared/ui';
import EditSVG from '@/shared/assets/images/actions/edit.svg?react';

import { DnsModal } from '../dns-modal';

type Props = {
  onSuccess: () => void;
};

const CreateDns = withAccount(({ onSuccess }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModalState();

  return (
    <>
      <Button icon={EditSVG} text="Create dDNS" size="medium" color="light" onClick={openModal} noWrap />

      {isModalOpen && <DnsModal close={closeModal} onSuccess={onSuccess} heading="Create DNS" submitText="Create" />}
    </>
  );
});

export { CreateDns };
