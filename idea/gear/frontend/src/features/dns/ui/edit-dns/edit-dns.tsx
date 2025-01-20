import { Button } from '@gear-js/ui';

import { useModalState } from '@/hooks';
import EditSVG from '@/shared/assets/images/actions/edit.svg?react';

import { Values } from '../../types';
import { DnsModal } from '../dns-modal';
import styles from './edit-dns.module.scss';

type Props = {
  initialValues: Values;
  secondary?: boolean;
  onSuccess: () => void;
};

const EditDns = ({ onSuccess, secondary, initialValues }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModalState();

  return (
    <>
      <Button
        icon={EditSVG}
        text={secondary ? undefined : 'Edit'}
        color={secondary ? 'transparent' : 'secondary'}
        className={secondary ? undefined : styles.button}
        onClick={openModal}
        noWrap
      />

      {isModalOpen && (
        <DnsModal
          close={closeModal}
          onSuccess={onSuccess}
          initialValues={initialValues}
          heading="Change program address"
          submitText="Submit"
        />
      )}
    </>
  );
};

export { EditDns };
