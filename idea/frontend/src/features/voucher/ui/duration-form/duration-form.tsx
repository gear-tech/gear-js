import { useApi } from '@gear-js/react-hooks';
import { Radio, Button, Select } from '@gear-js/ui';
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
    () => (isOptionExists ? options : [...options, getCustomOption(Number(value), blockTimeMs)]),
    [blockTimeMs, value, isOptionExists, options],
  );

  return (
    <div className={styles.options}>
      <div className={styles.option}>
        <Radio label="Blocks" />

        <div className={styles.blocks}>
          <Input type="number" name={FIELD_NAME.DURATION} />

          <div>
            <p>
              <span className={styles.key}>Min:</span>

              <Button
                text={minDuration}
                color="transparent"
                className={styles.button}
                onClick={() => onChange(minDuration)}
              />
            </p>

            <p>
              <span className={styles.key}>Max:</span>

              <Button
                text={maxDuration}
                color="transparent"
                className={styles.button}
                onClick={() => onChange(maxDuration)}
              />
            </p>
          </div>
        </div>
      </div>

      <div className={styles.option}>
        <Radio label="Time:" />

        <div>
          <Select options={customizedOptions} value={value} onChange={({ target }) => onChange(target.value)} />
        </div>
      </div>
    </div>
  );
};

export { DurationForm };
