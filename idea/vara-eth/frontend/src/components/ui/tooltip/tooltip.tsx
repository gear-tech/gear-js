import { Tooltip as BaseTooltip } from '@base-ui/react';
import type { ReactElement, ReactNode } from 'react';

import styles from './tooltip.module.scss';

type Props = {
  value: ReactNode;
  children: ReactElement;
  showOnDisabledTrigger?: boolean;
};

function Tooltip({ value, children, showOnDisabledTrigger }: Props) {
  if (!value) return children;

  return (
    <BaseTooltip.Provider delay={0}>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger
          render={showOnDisabledTrigger ? <span>{children}</span> : (children as ReactElement<Record<string, unknown>>)}
        />

        <BaseTooltip.Portal>
          <BaseTooltip.Positioner sideOffset={8} className={styles.positioner}>
            <BaseTooltip.Popup className={styles.popup}>{value}</BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}

export { Tooltip };
