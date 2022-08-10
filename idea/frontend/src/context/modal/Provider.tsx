import { useState, useCallback, useMemo, useEffect } from 'react';

import { MODALS } from './consts';
import { ModalName, ModalProperties } from './types';
import { Props } from '../types';
import { ModalContext } from './Context';

const { Provider } = ModalContext;

const ModalProvider = ({ children }: Props) => {
  const [modalName, setModalName] = useState<ModalName | null>(null);
  const [modalProps, setModalProps] = useState<any>(null);

  const closeModal = useCallback(() => {
    setModalName(null);
    setModalProps(null);
  }, []);

  const showModal = useCallback(<K extends ModalName>(name: K, props?: ModalProperties<K>) => {
    setModalName(name);
    setModalProps(props ?? {});
  }, []);

  const value = useMemo(
    () => ({
      showModal,
      closeModal,
    }),
    [showModal, closeModal]
  );

  useEffect(() => {
    if (modalName) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      if (modalName) {
        document.body.style.overflow = 'auto';
      }
    };
  }, [modalName]);

  const currentModal = useMemo(() => {
    if (modalName && modalProps) {
      const ModalComponent = MODALS[modalName];

      return <ModalComponent onClose={closeModal} {...modalProps} />;
    }
  }, [modalName, modalProps, closeModal]);

  return (
    <Provider value={value}>
      {children}
      {currentModal}
    </Provider>
  );
};

export { ModalProvider };
