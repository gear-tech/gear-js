import { Button } from '@gear-js/ui';

import { useModalState } from '@/hooks';
import EditSVG from '@/shared/assets/images/actions/edit.svg?react';

import { Values } from '../../types';
import { DnsModal } from '../dns-modal';
import styles from './edit-dns.module.scss';

type Props = {
  initialValues: Values;
  onSuccess: () => void;
};

const EditDns = ({ onSuccess, initialValues }: Props) => {
  const [isModalOpen, openModal, closeModal] = useModalState();

  return (
    <>
      <Button
        icon={EditSVG}
        text="Change program address"
        size="medium"
        color="transparent"
        className={styles.link}
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
