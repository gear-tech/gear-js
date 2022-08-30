import { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import clsx from 'clsx';
import { useAlert } from '@gear-js/react-hooks';
import { Modal, buttonStyles } from '@gear-js/ui/dist/esm';

import { ModalProps } from 'entities/modal';
import { checkFileFormat } from 'shared/helpers';
import uploadFileSVG from 'shared/assets/images/actions/uploadFile.svg';

import styles from './UploadFileModal.module.scss';
import { FILE_INPUT_ID } from '../model/const';
import { DropTarget } from './dropTarget';

type Props = ModalProps & {
  name: string;
  redirectTo: string;
};

const UploadFileModal = ({ name, redirectTo, onClose }: Props) => {
  const alert = useAlert();
  const navigate = useNavigate();

  const handleUploadFile = (file?: File) => {
    try {
      if (!file) {
        throw new Error('Empty file!');
      }

      if (!checkFileFormat(file)) {
        throw new Error('Wrong file format');
      }

      navigate(redirectTo, { state: { file } });
      onClose();
    } catch (error) {
      const message = (error as Error).message;

      alert.error(message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    handleUploadFile(file);
  };

  const heading = `Upload new ${name}`;

  const labelStyles = clsx(buttonStyles.button, buttonStyles.medium, buttonStyles.primary, styles.fileLabel);

  return (
    <Modal heading={heading} className={styles.modalContent} close={onClose}>
      <label htmlFor={FILE_INPUT_ID} className={labelStyles}>
        <img src={uploadFileSVG} alt="file" className={buttonStyles.icon} />
        Select File
        <input id={FILE_INPUT_ID} type="file" className={styles.fileInput} onChange={handleChange} />
      </label>
      <DndProvider backend={HTML5Backend}>
        <DropTarget onUpload={handleUploadFile} />
      </DndProvider>
    </Modal>
  );
};

export { UploadFileModal };
