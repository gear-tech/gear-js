import { Hex } from '@gear-js/api';
import { Modal, Input, Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { generatePath, useNavigate } from 'react-router-dom';

import { ModalProps } from 'entities/modal';
import { absoluteRoutes } from 'shared/config';
import { isHexValid } from 'shared/helpers';
import { useIsProgramExists } from 'hooks';

import styles from './MessageModal.module.scss';

const initialValues = { programId: '' as Hex };
const validate = { programId: isHexValid };
const initForm = { initialValues, validate };

const MessageModal = ({ onClose }: ModalProps) => {
  const navigate = useNavigate();

  const { values, errors, getInputProps, onSubmit, setFieldError } = useForm(initForm);
  const { programId } = values;

  const { isProgramExists, isProgramExistenceReady } = useIsProgramExists(programId);

  const isError = !!errors.programId;
  const isSubmitDisabled = !isProgramExistenceReady || isError;

  const handleSuccess = () => {
    const sendMessagePage = generatePath(absoluteRoutes.sendMessage, { programId });

    navigate(sendMessagePage);
    onClose();
  };

  const handleError = () => setFieldError('programId', 'Program not found in the storage');

  const handleSubmit = onSubmit(async () => ((await isProgramExists()) ? handleSuccess() : handleError()));

  return (
    <Modal heading="Send Message" close={onClose}>
      <form onSubmit={handleSubmit}>
        <Input label="Destination" direction="y" className={styles.input} {...getInputProps('programId')} />
        <Button type="submit" text="Continue" disabled={isSubmitDisabled} block />
      </form>
    </Modal>
  );
};

export { MessageModal };
