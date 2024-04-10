import { useApi } from '@gear-js/react-hooks';
import { Button, Select } from '@gear-js/ui';
import { useMemo } from 'react';

import { Input } from '@/shared/ui';

import { FIELD_NAME } from '../../consts';
import { getMilliseconds, getPluralizedUnit, getTime } from '../../utils';
import styles from './duration-form.module.scss';

type Props = {
  value: string;
  onChange: (duration: string) => void;
};

const DURATION_UNIT = {
  HOUR: 'hour',
  DAY: 'day',
  MONTH: 'month',
} as const;

const OPTIONS = [
  { value: 1, unit: DURATION_UNIT.HOUR },
  { value: 3, unit: DURATION_UNIT.HOUR },
  { value: 6, unit: DURATION_UNIT.HOUR },
  { value: 12, unit: DURATION_UNIT.HOUR },
  { value: 1, unit: DURATION_UNIT.DAY },
  { value: 7, unit: DURATION_UNIT.DAY },
  { value: 14, unit: DURATION_UNIT.DAY },
  { value: 1, unit: DURATION_UNIT.MONTH },
  { value: 2, unit: DURATION_UNIT.MONTH },
];

const DurationForm = ({ value, onChange }: Props) => {
  const { api } = useApi();
  const blockTimeMs = api?.consts.babe.expectedBlockTime.toNumber() || 0;
  const minDuration = api?.voucher.minDuration.toString() || '0';
  const maxDuration = api?.voucher.maxDuration.toString() || '0';

  const options = useMemo(
    () =>
      OPTIONS.map((option) => {
        const ms = getMilliseconds(option.value, option.unit);
        const blocks = Math.ceil(ms / blockTimeMs);

        return { value: blocks.toString(), label: getPluralizedUnit(option.value, option.unit) };
      }),
    [blockTimeMs],
  );

  const isOptionExists = useMemo(() => options.some((option) => option.value === value), [value, options]);

  const optionsWithValue = useMemo(
    () =>
      isOptionExists ? options : [...options, { label: getTime(blockTimeMs * Number(value)), value, disabled: true }],
    [blockTimeMs, value, isOptionExists, options],
  );

  return (
    <div className={styles.duration}>
      <div className={styles.blocks}>
        <Input type="number" label="Blocks:" name={FIELD_NAME.DURATION} />

        <div className={styles.minMax}>
          <p>
            <span>Min:</span>
            <Button text={minDuration} color="transparent" onClick={() => onChange(minDuration)} />
          </p>

          <p>
            <span>Max:</span>
            <Button text={maxDuration} color="transparent" onClick={() => onChange(maxDuration)} />
          </p>
        </div>
      </div>

      <Select
        label="Time:"
        gap="1.1/8.9"
        options={optionsWithValue}
        value={value}
        onChange={({ target }) => onChange(target.value)}
      />
    </div>
  );
};

export { DurationForm };
