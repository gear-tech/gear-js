import { Popover as BasePopover } from '@base-ui/react';
import { Input } from '@gear-js/ui';
import { DayFlag, DayPicker, SelectionState, UI } from 'react-day-picker';

import CalendarSVG from './calendar.svg?react';
import styles from './date-filter.module.scss';

const CALENDAR_CLASS_NAMES = {
  [UI.Months]: styles.calendar,
  [UI.MonthCaption]: styles.heading,
  [UI.PreviousMonthButton]: styles.buttonPrev,
  [UI.NextMonthButton]: styles.buttonNext,
  [UI.Chevron]: styles.buttonIcon,
  [UI.Weekdays]: styles.weekdays,
  [UI.MonthGrid]: styles.month,
  [UI.Day]: styles.day,
  [UI.DayButton]: styles.dayButton,
  [SelectionState.range_start]: styles.dayStart,
  [SelectionState.range_middle]: styles.dayMiddle,
  [SelectionState.range_end]: styles.dayEnd,
  [SelectionState.selected]: styles.daySelected,
  [DayFlag.outside]: styles.dayOutside,
};

function DateFilter() {
  return (
    <BasePopover.Root>
      <BasePopover.Trigger
        nativeButton={false}
        render={
          <div>
            <Input placeholder="Date" icon={CalendarSVG} className={styles.input} readOnly />
          </div>
        }
      />

      <BasePopover.Portal>
        <BasePopover.Positioner sideOffset={8} collisionAvoidance={{ side: 'none' }} className={styles.positioner}>
          <BasePopover.Popup className={styles.popup}>
            <DayPicker mode="range" navLayout="around" classNames={CALENDAR_CLASS_NAMES} showOutsideDays />
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

export { DateFilter };
