import { Popover as BasePopover } from '@base-ui/react';
import { Input } from '@gear-js/ui';
import { DateRange, DayFlag, DayPicker, SelectionState, UI } from 'react-day-picker';
import { FieldValues, Path, useController, useFormContext } from 'react-hook-form';

import CalendarSVG from '../../assets/calendar.svg?react';

import styles from './date-range-input.module.scss';

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

type Props = {
  value: { from: string; to: string };
  onChange: (value: { from: string; to: string }) => void;
};

function UIDateRangeInput({ value, onChange }: Props) {
  const parsedValue = {
    from: value.from ? new Date(value.from) : undefined,
    to: value.to ? new Date(value.to) : undefined,
  };

  const format = (dateRange: DateRange | undefined) => {
    const from = dateRange?.from ? new Date(dateRange.from) : undefined;
    const to = dateRange?.to ? new Date(dateRange.to) : undefined;

    from?.setHours(0, 0, 0, 0);
    to?.setHours(23, 59, 59, 999);

    return { from: from?.toISOString() ?? '', to: to?.toISOString() ?? '' };
  };

  const getInputValue = () => {
    const from = parsedValue?.from?.toLocaleDateString();
    const to = parsedValue?.to?.toLocaleDateString();

    if (from && to) return from === to ? from : `${from} - ${to}`;

    return '';
  };

  return (
    <BasePopover.Root>
      <BasePopover.Trigger
        nativeButton={false}
        render={
          <div>
            <Input
              label="Date"
              direction="y"
              placeholder="Select date range..."
              icon={CalendarSVG}
              className={styles.input}
              readOnly
              value={getInputValue()}
            />
          </div>
        }
      />

      <BasePopover.Portal>
        <BasePopover.Positioner sideOffset={8} collisionAvoidance={{ side: 'none' }} className={styles.positioner}>
          <BasePopover.Popup className={styles.popup}>
            <DayPicker
              mode="range"
              navLayout="around"
              classNames={CALENDAR_CLASS_NAMES}
              selected={parsedValue}
              onSelect={(_value) => onChange(format(_value))}
              showOutsideDays
              ISOWeek
            />
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

type DateRangeInputProps<T> = {
  fromName: Path<T>;
  toName: Path<T>;
  onSubmit: (values: T) => void;
};

function DateRangeInput<T extends FieldValues>({ fromName, toName, onSubmit }: DateRangeInputProps<T>) {
  const { handleSubmit } = useFormContext<T>();

  const { field: fromField } = useController<T>({ name: fromName });
  const { field: toField } = useController<T>({ name: toName });
  const value = { from: fromField.value, to: toField.value };

  const handleChange = ({ from, to }: { from: string; to: string }) => {
    fromField.onChange(from);
    toField.onChange(to);

    void handleSubmit(onSubmit)();
  };

  return <UIDateRangeInput value={value} onChange={handleChange} />;
}

export { DateRangeInput };
