import { Popover as BasePopover } from '@base-ui/react';
import { Input } from '@gear-js/ui';

import CalendarSVG from './calendar.svg?react';
import styles from './date-filter.module.scss';
import 'react-day-picker/style.css';

function DateFilter() {
  return (
    <BasePopover.Root>
      <BasePopover.Trigger
        nativeButton={false}
        render={
          <div>
            <Input icon={CalendarSVG} className={styles.input} readOnly />
          </div>
        }
      />

      <BasePopover.Portal>
        <BasePopover.Positioner sideOffset={8} className={styles.positioner}>
          <BasePopover.Popup className={styles.popup}></BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

export { DateFilter };
