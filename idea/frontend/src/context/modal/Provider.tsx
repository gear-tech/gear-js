import { FC, useState, useCallback, useMemo, useEffect } from 'react';
import { lock, unlock } from 'tua-body-scroll-lock';

import { ModalProps, InpitModalProps } from './types';
import { Props } from '../types';
import { ModalContext } from './Context';

const { Provider } = ModalContext;

const ModalProvider = ({ children }: Props) => {
  const [currentModal, setCurrentModal] = useState<JSX.Element | null>(null);

  const closeModal = useCallback(() => setCurrentModal(null), []);

  const showModal = useCallback(
    <Props extends ModalProps>(Modal: FC<Props>, props?: InpitModalProps<Props>) => {
      // @ts-ignore
      setCurrentModal(<Modal {...(props || {})} onClose={closeModal} />);
    },
    [closeModal]
  );

  const value = useMemo(
    () => ({
      showModal,
      closeModal,
    }),
    [showModal, closeModal]
  );

  useEffect(() => {
    if (currentModal) {
      lock();
    }

    return () => {
      if (currentModal) {
        unlock();
      }
    };
  }, [currentModal]);

  return (
    <Provider value={value}>
      {children}
      {currentModal}
    </Provider>
  );
};

export { ModalProvider };
