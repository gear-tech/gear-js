import { useState, useCallback, useMemo, useEffect, ReactNode } from 'react';

import { useOnboarding } from '@/hooks';
import { disableScroll, enableScroll } from '@/shared/helpers';

import { ModalContext } from './Context';
import { MODALS } from './consts';
import { ModalName, ModalProperties } from './types';

const { Provider } = ModalContext;

type Props = {
  children: ReactNode;
};

const ModalProvider = ({ children }: Props) => {
  const [modalName, setModalName] = useState<ModalName | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any -- TODO(#1800): resolve eslint comments
  const [modalProps, setModalProps] = useState<any>(null);

  const { isOnboardingActive } = useOnboarding();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- TODO(#1800): resolve eslint comments
      modalProps.onClose();

      // only exists in transaction modal and actually should extend onClose prop
      // however, cuz of Object.assign(defaultProps, props) it would be overrided
      // maybe it's worth to do a deep merge to handle such cases?

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- TODO(#1800): resolve eslint comments
      if (modalProps.onAbort) modalProps.onAbort();
    }
  };

  const closeModal = useCallback(() => {
    setModalName(null);
    setModalProps(null);
  }, []);

  const showModal = useCallback(
    <K extends ModalName>(name: K, props?: ModalProperties<K>) => {
      const defaultProps = { onClose: closeModal };

      setModalName(name);
      setModalProps(Object.assign(defaultProps, props));
    },
    [closeModal],
  );

  const value = useMemo(() => ({ showModal, closeModal }), [showModal, closeModal]);

  useEffect(() => {
    if (!modalName || !modalProps || isOnboardingActive) return;

    disableScroll();

    return () => {
      enableScroll();
    };
  }, [modalName, modalProps, isOnboardingActive]);

  useEffect(() => {
    if (!modalName || !modalProps) return;

    document.addEventListener('keydown', handleKeyDown, false);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalName, modalProps]);

  const currentModal = useMemo(() => {
    if (modalName && modalProps) {
      const ModalComponent = MODALS[modalName];

      return <ModalComponent {...modalProps} />;
    }
  }, [modalName, modalProps]);

  return (
    <Provider value={value}>
      {children}
      {currentModal}
    </Provider>
  );
};

export { ModalProvider };
