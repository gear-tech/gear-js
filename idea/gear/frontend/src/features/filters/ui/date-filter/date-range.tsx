import { Button } from '@gear-js/ui';
import { useState } from 'react';
import { DateRange as DateRangeType, DayFlag, DayPicker, SelectionState, UI } from 'react-day-picker';

import styles from './date-range.module.scss';

const CLASS_NAMES = {
  [UI.Months]: styles.container,
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

type Props = {
  defaultValue: DateRangeType | undefined;
  onSubmit: (value: DateRangeType | undefined) => void;
  onClose: () => void;
};

function DateRange({ defaultValue, onSubmit, onClose }: Props) {
  const [value, setValue] = useState(defaultValue);

  const handleApplyClick = () => {
    onSubmit(value);
    onClose();
  };

  return (
    <>
      <DayPicker
        mode="range"
        navLayout="around"
        classNames={CLASS_NAMES}
        selected={value}
        onSelect={(_value) => setValue(_value)}
        showOutsideDays
        ISOWeek
      />

      <footer className={styles.footer}>
        <Button text="Cancel" size="small" color="light" onClick={onClose} />
        <Button text="Apply" size="small" onClick={handleApplyClick} />
      </footer>
    </>
  );
}

export { DateRange };
