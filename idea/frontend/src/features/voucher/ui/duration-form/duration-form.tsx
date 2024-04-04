import { useApi } from '@gear-js/react-hooks';
import { Button, Select } from '@gear-js/ui';
import { useMemo } from 'react';

import { Input } from '@/shared/ui';

import { FIELD_NAME } from '../../consts';
import { getCustomOption, getOptions } from '../../utils';
import styles from './duration-form.module.scss';

type Props = {
  value: string;
  onChange: (duration: string) => void;
};

const DurationForm = ({ value, onChange }: Props) => {
  const { api } = useApi();
  const blockTimeMs = api?.consts.babe.expectedBlockTime.toNumber() || 0;
  const minDuration = api?.voucher.minDuration.toString() || '0';
  const maxDuration = api?.voucher.maxDuration.toString() || '0';

  const options = useMemo(() => getOptions(blockTimeMs), [blockTimeMs]);
  const isOptionExists = useMemo(() => options.some((option) => option.value === value), [value, options]);

  const customizedOptions = useMemo(
    () => (isOptionExists ? options : [...options, getCustomOption(value, blockTimeMs)]),
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
        options={customizedOptions}
        value={value}
        onChange={({ target }) => onChange(target.value)}
      />
    </div>
  );
};

export { DurationForm };
