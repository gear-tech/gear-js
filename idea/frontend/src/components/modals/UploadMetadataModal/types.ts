import { ModalProps } from 'context/modal/types';

export type UploadMetadataModalProps = ModalProps & {
  onCancel?: () => void;
  onConfirm: () => void;
};
