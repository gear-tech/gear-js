import { ChangeEvent } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import clsx from 'clsx';
import { useAlert } from '@gear-js/react-hooks';
import { Modal, buttonStyles } from '@gear-js/ui';

import { ModalProps } from 'entities/modal';
import { checkFileFormat } from 'shared/helpers';
import { ReactComponent as UploadFileSVG } from 'shared/assets/images/actions/uploadFile.svg';

import { FileTypes } from 'shared/config';
import styles from './UploadFileModal.module.scss';
import { FILE_INPUT_ID } from '../model/const';
import { DropTarget } from './dropTarget';

type Props = ModalProps & {
  name: string;
  onUpload: (file: File) => void;
};

const UploadFileModal = ({ name, onClose, onUpload }: Props) => {
  const alert = useAlert();

  const handleUploadFile = (file: File | undefined) => {
    try {
      if (!file) throw new Error('Empty file!');
      if (!checkFileFormat(file)) throw new Error('Wrong file format');

      onUpload(file);
      onClose();
    } catch (error) {
      const { message } = error as Error;

      alert.error(message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    handleUploadFile(file);
  };

  const labelStyles = clsx(buttonStyles.button, buttonStyles.medium, buttonStyles.primary, styles.fileLabel);

  return (
    <Modal heading={`Upload new ${name}`} className={styles.modalContent} close={onClose}>
      <label htmlFor={FILE_INPUT_ID} className={labelStyles}>
        <UploadFileSVG className={buttonStyles.icon} />
        Select File
        <input
          id={FILE_INPUT_ID}
          type="file"
          className={styles.fileInput}
          onChange={handleChange}
          accept={FileTypes.Wasm}
        />
      </label>
      <DndProvider backend={HTML5Backend}>
        <DropTarget onUpload={handleUploadFile} />
      </DndProvider>
    </Modal>
  );
};

export { UploadFileModal };
