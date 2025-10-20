import { Dialog } from '@base-ui-components/react/dialog';
import { PropsWithChildren } from 'react';

import styles from './default-dialog.module.scss';

type Props = PropsWithChildren & {
  heading: string;
  isOpen: boolean;
  close: () => void;
};

function DefaultDialog({ children, heading, isOpen, close }: Props) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.popup}>
          <header className={styles.header}>
            <Dialog.Title className={styles.title}>{heading}</Dialog.Title>
            <Dialog.Close>Close</Dialog.Close>
          </header>

          <div>{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { DefaultDialog };
