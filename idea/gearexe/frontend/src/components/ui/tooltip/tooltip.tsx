import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import styles from './tooltip.module.scss';

type Props = {
  value?: ReactNode;
  position?: 'top' | 'right' | 'bottom-end';
  children?: ReactNode;
};

function TooltipComponent({ value, style }: { value: ReactNode; style: CSSProperties }) {
  const [root, setRoot] = useState<HTMLElement>();

  useEffect(() => {
    const ID = 'tooltip-root';
    const existingRoot = document.getElementById(ID);

    if (existingRoot) return setRoot(existingRoot);

    const newRoot = document.createElement('div');
    newRoot.id = ID;
    document.body.appendChild(newRoot);

    setRoot(newRoot);

    return () => {
      if (!newRoot) return;

      document.body.removeChild(newRoot);
    };
  }, []);

  if (!root) return null;

  return createPortal(
    <div className={styles.tooltip} style={style}>
      {typeof value === 'string' ? <p className={styles.heading}>{value}</p> : value}
    </div>,
    root,
  );
}

function Tooltip({ value, position = 'top', children }: Props) {
  const [style, setStyle] = useState<CSSProperties>();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    const container = containerRef.current;

    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    const GAP = 8;
    let top = 0;
    let left = 0;
    let transform = '';

    switch (position) {
      case 'top': {
        top = containerRect.top + window.scrollY - GAP;
        left = containerRect.left + window.scrollX + containerRect.width / 2;
        transform = 'translate(-50%, -100%)';

        break;
      }

      case 'right': {
        top = containerRect.top + window.scrollY + containerRect.height / 2;
        left = containerRect.right + window.scrollX + GAP;
        transform = 'translateY(-50%)';

        break;
      }
      case 'bottom-end': {
        top = containerRect.bottom + window.scrollY + GAP;
        left = containerRect.right - window.scrollX;
        transform = 'translate(-100%, 0)';

        break;
      }

      default:
        break;
    }

    setStyle({ top, left, transform });
  };

  return (
    <div
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setStyle(undefined)}
      ref={containerRef}>
      <div className={styles.body}>{children}</div>

      {style && <TooltipComponent value={value} style={style} />}
    </div>
  );
}

export { Tooltip };
