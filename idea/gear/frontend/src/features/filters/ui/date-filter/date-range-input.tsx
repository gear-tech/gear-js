import { Popover } from '@base-ui/react';
import { useState } from 'react';
import { DateRange as DateRangeType } from 'react-day-picker';

import { DateInput } from './date-input';
import { DateRange } from './date-range';
import styles from './date-range-input.module.scss';

type Props = {
  value: { from: string; to: string };
  onChange: (value: { from: string; to: string }) => void;
};

function DateRangeInput({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const parsedValue = {
    from: value.from ? new Date(value.from) : undefined,
    to: value.to ? new Date(value.to) : undefined,
  };

  const format = (dateRange: DateRangeType | undefined) => {
    const from = dateRange?.from ? new Date(dateRange.from) : undefined;
    const to = dateRange?.to ? new Date(dateRange.to) : undefined;

    from?.setHours(0, 0, 0, 0);
    to?.setHours(23, 59, 59, 999);

    return { from: from?.toISOString() ?? '', to: to?.toISOString() ?? '' };
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger nativeButton={false} render={<DateInput value={parsedValue} />} />

      <Popover.Portal>
        <Popover.Positioner sideOffset={8} className={styles.positioner}>
          <Popover.Popup className={styles.popup}>
            <DateRange
              defaultValue={parsedValue}
              onSubmit={(_value) => onChange(format(_value))}
              onClose={() => setIsOpen(false)}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

export { DateRangeInput };
