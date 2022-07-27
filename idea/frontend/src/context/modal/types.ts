import { FC } from 'react';

export type Modals = {
  [key: string]: FC<any>;
};

export type ModalProps = {
  onClose: () => void;
};

export type InpitModalProps<Props extends ModalProps> = Omit<Props, 'onClose'> & Partial<Pick<Props, 'onClose'>>;

export type ModalContainerFactory = {
  showModal: <Props extends ModalProps>(modal: FC<Props>, props?: InpitModalProps<Props>) => void;
  closeModal: () => void;
};
