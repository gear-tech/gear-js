import { Dialog } from '@base-ui-components/react/dialog';
import { PropsWithChildren } from 'react';

import styles from './default-dialog.module.scss';

type Props = PropsWithChildren & {
  isOpen: boolean;
  close: () => void;
};

function DefaultDialog({ children, isOpen, close }: Props) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Trigger className={styles.Button}>View notifications</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.Backdrop} />
        <Dialog.Popup className={styles.Popup}>
          <Dialog.Title className={styles.Title}>Notifications</Dialog.Title>

          <div>{children}</div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { DefaultDialog };
