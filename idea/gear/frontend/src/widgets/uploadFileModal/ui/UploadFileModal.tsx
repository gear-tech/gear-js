import { Modal, buttonStyles } from '@gear-js/ui';
import cx from 'clsx';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { useNavigate } from 'react-router-dom';

import { ModalProps } from '@/entities/modal';
import UploadFileSVG from '@/shared/assets/images/actions/uploadFile.svg?react';
import { FileTypes, absoluteRoutes, routes } from '@/shared/config';
import { useWasmFileHandler } from '@/features/code';

import { FILE_INPUT_ID } from '../model/const';
import { DropTarget } from './dropTarget';
import styles from './UploadFileModal.module.scss';

type Props = ModalProps & {
  name: 'code' | 'program';
};

const UploadFileModal = ({ name, onClose }: Props) => {
  const navigate = useNavigate();

  const handleChange = useWasmFileHandler(name, (file, buffer) => {
    if (!file || !buffer) return;

    const route = name === 'program' ? absoluteRoutes.uploadProgram : routes.uploadCode;

    navigate(route, { state: { file, buffer } });
    onClose();
  });

  return (
    <Modal heading={`Upload new ${name}`} className={styles.modalContent} close={onClose}>
      <label
        htmlFor={FILE_INPUT_ID}
        className={cx(buttonStyles.button, buttonStyles.medium, buttonStyles.primary, styles.fileLabel)}>
        <UploadFileSVG className={buttonStyles.icon} />
        Select File
        <input
          id={FILE_INPUT_ID}
          type="file"
          className={styles.fileInput}
          onChange={({ target }) => handleChange(target.files?.[0])}
          accept={FileTypes.Wasm}
        />
      </label>

      <DndProvider backend={HTML5Backend}>
        <DropTarget onUpload={handleChange} />
      </DndProvider>
    </Modal>
  );
};

export { UploadFileModal };
