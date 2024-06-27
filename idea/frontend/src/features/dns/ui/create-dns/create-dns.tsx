import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import cx from 'clsx';

import { withAccount } from '@/shared/ui';
import EditSVG from '@/shared/assets/images/actions/edit.svg?react';

import { useModal } from '../../hooks';
import styles from './create-dns.module.scss';
import { CreateDnsModal } from '../create-dns-modal';

type Props = {
  programId?: HexString;
  buttonSize?: 'small' | 'medium';
  buttonColor?: 'secondary' | 'light' | 'transparent';
  onSuccess?: () => void;
};

const CreateDns = withAccount(({ buttonColor = 'light', buttonSize = 'medium', onSuccess }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModal();

  return (
    <>
      <Button
        icon={EditSVG}
        text="Create dDNS"
        size={buttonSize}
        color={buttonColor}
        className={cx(buttonColor === 'transparent' && styles.link)}
        onClick={openModal}
        noWrap
      />

      {isModalOpen && <CreateDnsModal close={closeModal} onSuccess={onSuccess} />}
    </>
  );
});

export { CreateDns };
