import { Input } from '@gear-js/ui';
import { HTMLProps } from 'react';
import { DateRange } from 'react-day-picker';

import CalendarSVG from '../../assets/calendar.svg?react';

import styles from './date-input.module.scss';

type Props = Omit<HTMLProps<HTMLDivElement>, 'value'> & {
  value: DateRange | undefined;
};

function DateInput({ value, ...props }: Props) {
  const format = () => {
    const from = value?.from?.toLocaleDateString();
    const to = value?.to?.toLocaleDateString();

    if (from && to) return from === to ? from : `${from} - ${to}`;

    return '';
  };

  return (
    <div {...props}>
      <Input
        label="Date"
        direction="y"
        placeholder="Select date range..."
        icon={CalendarSVG}
        className={styles.input}
        value={format()}
        readOnly
      />
    </div>
  );
}

export { DateInput };
