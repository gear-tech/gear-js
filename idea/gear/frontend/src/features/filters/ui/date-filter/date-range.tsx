import { Button } from '@gear-js/ui';
import { useState } from 'react';
import {
  DateRange as DateRangeType,
  DayFlag,
  DayPicker,
  SelectionState,
  UI,
  CaptionLabelProps,
} from 'react-day-picker';

import { isString } from '@/shared/helpers';

import styles from './date-range.module.scss';
import { HeaderButton, MonthPicker, NextButton, PrevButton, YearPicker } from './picker';

const CLASS_NAMES = {
  [UI.MonthCaption]: styles.heading,
  [UI.Months]: styles.container,
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
  // if only 'from' or only 'to' is set (possible when one search param is invalid),
  // displayed ui will be empty, while everything works and its a valid state.
  // not a big issue right now, ground for future improvements
  const [value, setValue] = useState(defaultValue);

  const [month, setMonth] = useState(defaultValue?.from || defaultValue?.to || new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');

  const handleNavigateYearClick = (delta: number) =>
    setMonth((prevMonth) => new Date(prevMonth.getFullYear() + delta, prevMonth.getMonth()));

  const handleMonthClick = (monthIndex: number) => {
    setMonth((prevMonth) => new Date(prevMonth.getFullYear(), monthIndex));
    setView('days');
  };

  const handleYearClick = (year: number) => {
    setMonth((prevMonth) => new Date(year, prevMonth.getMonth()));
    setView('months');
  };

  const handleApplyClick = () => {
    onSubmit(value);
    onClose();
  };

  const renderHeader = ({ children }: CaptionLabelProps) => {
    if (!isString(children)) throw new Error('Invalid caption label children');

    return <HeaderButton text={children} onClick={() => setView('months')} />;
  };

  return (
    <>
      {view === 'days' && (
        <DayPicker
          mode="range"
          navLayout="around"
          components={{ CaptionLabel: renderHeader, PreviousMonthButton: PrevButton, NextMonthButton: NextButton }}
          classNames={CLASS_NAMES}
          selected={value}
          onSelect={(_value) => setValue(_value)}
          showOutsideDays
          ISOWeek
          month={month}
          onMonthChange={setMonth}
        />
      )}

      {view === 'months' && (
        <MonthPicker
          currentYear={month.getFullYear()}
          onClick={handleMonthClick}
          onNavigateYearClick={handleNavigateYearClick}
          onYearClick={() => setView('years')}
          onBackClick={() => setView('days')}
        />
      )}

      {view === 'years' && <YearPicker onClick={handleYearClick} onBackClick={() => setView('months')} />}

      {view === 'days' && (
        <footer className={styles.footer}>
          <Button text="Cancel" size="small" color="light" onClick={onClose} />
          <Button text="Apply" size="small" onClick={handleApplyClick} />
        </footer>
      )}
    </>
  );
}

export { DateRange };
