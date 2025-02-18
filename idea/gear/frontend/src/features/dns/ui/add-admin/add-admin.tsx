import { HexString } from '@gear-js/api';
import { Button, Modal, ModalProps } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useModalState } from '@/hooks';
import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';
import { ACCOUNT_ADDRESS_SCHEMA } from '@/shared/config';
import { FormButtons, Input } from '@/shared/ui';

import { FUNCTION_NAME } from '../../consts';
import { useSendDnsTransaction } from '../../hooks';

import styles from './add-admin.module.scss';

const FIELD_NAME = {
  ADDRESS: 'address',
} as const;

const DEFAULT_VALUES = {
  [FIELD_NAME.ADDRESS]: '',
};

type Props = {
  name: string;
  admins: HexString[];
  onSuccess: () => void;
};

function AddAdminModal({ name, admins, onSuccess, close }: Pick<ModalProps, 'close'> & Props) {
  const schema = z.object({
    [FIELD_NAME.ADDRESS]: ACCOUNT_ADDRESS_SCHEMA.refine((value) => !admins.includes(value), 'Admin already exists'),
  });

  const form = useForm<typeof DEFAULT_VALUES, unknown, z.infer<typeof schema>>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(schema),
  });

  const { sendTransaction, isLoading } = useSendDnsTransaction(FUNCTION_NAME.ADD_ADMIN);

  const handleSubmit = form.handleSubmit(({ address }) => {
    const _onSuccess = () => {
      close();
      onSuccess();
    };

    sendTransaction([name, address], _onSuccess);
  });

  return (
    <Modal heading="Add Admin" size="large" close={close}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input name={FIELD_NAME.ADDRESS} label="Account address" direction="y" block />
          <FormButtons disabled={isLoading} onCloseClick={close} />
        </form>
      </FormProvider>
    </Modal>
  );
}

function AddAdmin({ name, admins, onSuccess }: Props) {
  const [isModalOpen, openModal, closeModal] = useModalState();

  return (
    <>
      <Button icon={PlusSVG} text="Add admin" color="grey" onClick={openModal} />

      {isModalOpen && <AddAdminModal name={name} admins={admins} onSuccess={onSuccess} close={closeModal} />}
    </>
  );
}

export { AddAdmin };
