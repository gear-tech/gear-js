import { FC } from 'react';

export type Modals = {
  [key: string]: FC<any>;
};

export type ModalProps = {
  onClose: () => void;
};

export type ModalContainerFactory = {
  showModal: <Props extends ModalProps>(modal: FC<Props>, props?: Omit<Props, 'onClose'>) => void;
  closeModal: () => void;
};
