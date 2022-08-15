import { ComponentProps } from 'react';

import { MODALS } from './consts';

export type ModalName = keyof typeof MODALS;

export type ModalProps = {
  onClose: () => void;
};

export type ModalProperties<T extends ModalName> = Omit<ComponentProps<typeof MODALS[T]>, 'onClose'> &
  Partial<ModalProps>;

export type ModalContainerFactory = {
  showModal: <K extends ModalName>(name: K, props?: ModalProperties<K>) => void;
  closeModal: () => void;
};
