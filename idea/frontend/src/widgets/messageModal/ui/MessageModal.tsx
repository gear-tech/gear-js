import { Modal, Input, Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { HexString } from '@polkadot/util/types';
import { generatePath, useNavigate } from 'react-router-dom';

import { ModalProps } from '@/entities/modal';
import { absoluteRoutes } from '@/shared/config';
import { isHexValid } from '@/shared/helpers';

import styles from './MessageModal.module.scss';

const initialValues = { programId: '' as HexString };
const validate = { programId: isHexValid };
const initForm = { initialValues, validate };

const MessageModal = ({ onClose }: ModalProps) => {
  const navigate = useNavigate();

  const { values, errors, getInputProps } = useForm(initForm);
  const { programId } = values;

  const isError = !!errors.programId;

  const handleSubmit = () => {
    const sendMessagePage = generatePath(absoluteRoutes.sendMessage, { programId });

    navigate(sendMessagePage);
    onClose();
  };

  return (
    <Modal heading="Send Message" close={onClose}>
      <form onSubmit={handleSubmit}>
        <Input label="Destination" direction="y" className={styles.input} {...getInputProps('programId')} />
        <Button type="submit" text="Continue" disabled={isError} block />
      </form>
    </Modal>
  );
};

export { MessageModal };
