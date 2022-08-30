import { useState, useCallback, useMemo, useEffect, ReactNode } from 'react';

import { MODALS } from './consts';
import { ModalName, ModalProperties } from './types';
import { ModalContext } from './Context';

const { Provider } = ModalContext;

type Props = {
  children: ReactNode;
};

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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  const value = useMemo(
    () => ({
      showModal,
      closeModal,
    }),
    [showModal, closeModal],
  );

  useEffect(() => {
    if (!modalName) {
      return;
    }

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown, false);

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleKeyDown, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalName]);

  const currentModal = useMemo(() => {
    if (modalName && modalProps) {
      const ModalComponent = MODALS[modalName];

      // eslint-disable-next-line react/jsx-props-no-spreading
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
