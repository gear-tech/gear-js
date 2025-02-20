import { Button } from '@gear-js/ui';

import { useModalState } from '@/hooks';
import DnsSVG from '@/shared/assets/images/menu/dns.svg?react';
import { withAccount } from '@/shared/ui';

import { DnsModal } from '../dns-modal';

type Props = {
  onSuccess: () => void;
  color?: 'light' | 'primary';
};

const CreateDns = withAccount(({ onSuccess, color = 'light' }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModalState();

  return (
    <>
      <Button icon={DnsSVG} text="Create dDNS" size="medium" color={color} onClick={openModal} noWrap />

      {isModalOpen && (
        <DnsModal close={closeModal} onSuccess={onSuccess} heading="Create dDNS" submitText="Create new dDNS" />
      )}
    </>
  );
});

export { CreateDns };
