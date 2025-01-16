import { cloneElement, CSSProperties, ReactNode, ReactElement, useState } from 'react';

import { useRootPortal } from '../../hooks';
import { getPosition } from './get-position';
import styles from './tooltip.module.scss';

type Props = {
  children: ReactElement;
  value?: ReactNode;
  position?:
    | 'top-start'
    | 'top'
    | 'top-end'
    | 'right-start'
    | 'right'
    | 'right-end'
    | 'bottom-start'
    | 'bottom'
    | 'bottom-end'
    | 'left-start'
    | 'left'
    | 'left-end';
};

function TooltipComponent({ value, style }: { value: ReactNode; style: CSSProperties }) {
  return useRootPortal(
    'tooltip-root',
    <div className={styles.tooltip} style={style}>
      {value}
    </div>,
  );
}

function Tooltip({ value, position = 'top', children }: Props) {
  const [style, setStyle] = useState<CSSProperties>();

  const handleMouseOver = (event: MouseEvent) => {
    const anchor = event.currentTarget as HTMLElement | null;
    if (!anchor) return;

    setStyle(getPosition(anchor, position));
  };

  return (
    <>
      {cloneElement(children, {
        onMouseOver: handleMouseOver,
        onMouseLeave: () => setStyle(undefined),
      })}

      {style && <TooltipComponent value={value} style={style} />}
    </>
  );
}

export { Tooltip };
export type { Props as TooltipProps };
