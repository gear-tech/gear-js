import { useApi } from '@gear-js/react-hooks';
import { Radio, Button } from '@gear-js/ui';
import { useMemo } from 'react';

import { INPUT_NAME } from './consts';
import { getCustomOption, getOptions } from './utils';
import styles from './issue-voucher-modal.module.scss';
import { Input, Select } from '@/shared/ui';

type Props = {
  duration: string;
  setDuration: (duration: string) => void;
};

const DurationForm = ({ duration, setDuration }: Props) => {
  const { api } = useApi();
  const blockTimeMs = api?.consts.babe.expectedBlockTime.toNumber() || 0;
  const minDuration = api?.voucher.minDuration.toString() || '0';
  const maxDuration = api?.voucher.maxDuration.toString() || '0';

  const options = useMemo(() => getOptions(blockTimeMs), [blockTimeMs]);
  const isOptionExists = useMemo(() => options.some(({ value }) => value === duration), [duration, options]);

  const customizedOptions = useMemo(
    () => (isOptionExists ? options : [...options, getCustomOption(Number(duration), blockTimeMs)]),
    [blockTimeMs, duration, isOptionExists, options],
  );

  return (
    <div className={styles.options}>
      <div className={styles.option}>
        <Radio label="Blocks" />

        <div className={styles.blocks}>
          <Input type="number" name={INPUT_NAME.DURATION} />

          <div>
            <p>
              <span className={styles.key}>Min:</span>

              <Button
                text={minDuration.toString()}
                color="transparent"
                className={styles.button}
                onClick={() => setDuration(minDuration)}
              />
            </p>

            <p>
              <span className={styles.key}>Max:</span>

              <Button
                text={maxDuration.toString()}
                color="transparent"
                className={styles.button}
                onClick={() => setDuration(maxDuration)}
              />
            </p>
          </div>
        </div>
      </div>

      <div className={styles.option}>
        <Radio label="Time:" />

        <div>
          <Select name={INPUT_NAME.DURATION_SELECT} options={customizedOptions} />
        </div>
      </div>
    </div>
  );
};

export { DurationForm };
