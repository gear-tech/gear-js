import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import cx from 'clsx';

import { withAccount } from '@/shared/ui';
import EditSVG from '@/shared/assets/images/actions/edit.svg?react';

import { EditDnsModal } from '../edit-dns-modal';
import { useModal } from '../../hooks';
import { DnsSchema } from '../../types';
import styles from './edit-dns.module.scss';

type Props = {
  initialValues: DnsSchema;
  programId?: HexString;
  buttonSize?: 'small' | 'medium';
  buttonColor?: 'secondary' | 'light' | 'transparent';
  onSuccess?: () => void;
};

const EditDns = withAccount(
  ({ buttonColor = 'transparent', buttonSize = 'medium', onSuccess, initialValues }: Props) => {
    const [isModalOpen, openModal, closeModal] = useModal();

    return (
      <>
        <Button
          icon={EditSVG}
          text="Change program address"
          size={buttonSize}
          color={buttonColor}
          className={cx(buttonColor === 'transparent' && styles.link)}
          onClick={openModal}
          noWrap
        />

        {isModalOpen && <EditDnsModal close={closeModal} onSuccess={onSuccess} initialValues={initialValues} />}
      </>
    );
  },
);

export { EditDns };
