import { ModalProps } from 'context/modal/types';

export type TransactionModalProps = ModalProps & {
  fee: string;
  name: string;
  addressTo: string;
  addressFrom: string;
  onCancel?: () => void;
  onConfirm: () => void;
};
