import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import cx from 'clsx';

import { withAccount } from '@/shared/ui';

import DnsSVG from '../../assets/edit.svg?react';
import { EditDnsModal } from '../edit-dns-modal';
import { useModal } from '../../hooks';
import styles from './edit-dns.module.scss';
import { DnsSchema } from '../../consts';

type Props = {
  initialValues: DnsSchema;
  programId?: HexString;
  buttonSize?: 'small' | 'medium';
  buttonColor?: 'secondary' | 'light' | 'transparent';
  onSubmit?: () => void;
};

const EditDns = withAccount(
  ({ buttonColor = 'transparent', buttonSize = 'medium', onSubmit, initialValues }: Props) => {
    const [isModalOpen, openModal, closeModal] = useModal();

    return (
      <>
        <Button
          icon={DnsSVG}
          text="Change program address"
          size={buttonSize}
          color={buttonColor}
          className={cx(buttonColor === 'transparent' && styles.link)}
          onClick={openModal}
          noWrap
        />

        {isModalOpen && <EditDnsModal close={closeModal} onSubmit={onSubmit} initialValues={initialValues} />}
      </>
    );
  },
);

export { EditDns };
