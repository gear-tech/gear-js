import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { cx } from '@/shared/helpers';

import styles from './verification-overlay.module.scss';

const OVERLAY_ROOT_ID = 'faucet-verification-overlay-root';

type Props = {
  isVisible: boolean;
  children: ReactNode;
};

function VerificationOverlay({ isVisible, children }: Props) {
  // temporary fast solution because menu z-index is higher than overlays z-index
  const [overlayRoot, setOverlayRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let root = document.getElementById(OVERLAY_ROOT_ID);

    if (!root) {
      root = document.createElement('div');
      root.id = OVERLAY_ROOT_ID;

      document.body.append(root);
    }

    setOverlayRoot(root);

    return () => {
      root?.remove();
    };
  }, []);

  const overlay = <div className={cx(styles.overlay, isVisible && styles.active)}>{children}</div>;

  return overlayRoot ? createPortal(overlay, overlayRoot) : overlay;
}

export { VerificationOverlay };
