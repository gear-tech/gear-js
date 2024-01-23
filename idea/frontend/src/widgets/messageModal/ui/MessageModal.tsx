import { Modal, Input, Button } from '@gear-js/ui';
import { HexString } from '@polkadot/util/types';
import { generatePath, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { ModalProps } from '@/entities/modal';
import { absoluteRoutes } from '@/shared/config';
import { isHexValid } from '@/shared/helpers';

import styles from './MessageModal.module.scss';

const defaultValues = { programId: '' as HexString };
const validate = isHexValid;

const MessageModal = ({ onClose }: ModalProps) => {
  const navigate = useNavigate();

  const form = useForm({ defaultValues });
  const { register, getFieldState, formState } = form;
  const { error } = getFieldState('programId', formState);

  const handleSubmit = ({ programId }: typeof defaultValues) => {
    const sendMessagePage = generatePath(absoluteRoutes.sendMessage, { programId });

    navigate(sendMessagePage);
    onClose();
  };

  return (
    <Modal heading="Send Message" close={onClose}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Input
          label="Destination"
          direction="y"
          className={styles.input}
          error={error?.message}
          {...register('programId', { validate })}
        />

        <Button type="submit" text="Continue" disabled={!!error} block />
      </form>
    </Modal>
  );
};

export { MessageModal };
