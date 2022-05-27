import { useState, ChangeEvent, useMemo } from 'react';
import { useField } from 'formik';
import { Select } from '@gear-js/ui';

import styles from '../../FormPayload.module.scss';
import { OPTION_OPTIONS, DEFAULT_VALUE } from './const';
import { PayloadItemProps } from '../../types';
import { parseTypeStructure } from '../../helpers';

import { useChangeEffect } from 'hooks';
import { Fieldset } from 'components/common/Fieldset';

const OptionItem = ({ levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const { name, value } = typeStructure;

  const [, , helpers] = useField(levelName);

  const [selected, setSelected] = useState(DEFAULT_VALUE);
  //@ts-ignore
  const parsedPayload = useMemo(() => parseTypeStructure(value), [value]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => setSelected(event.target.value);

  const isNone = selected === DEFAULT_VALUE;

  useChangeEffect(() => {
    const fieldValue = isNone ? null : parsedPayload;

    helpers.setValue(fieldValue, false);
  }, [isNone]);

  return (
    <Fieldset legend={name}>
      <div className={styles.selectWrapper}>
        <Select options={OPTION_OPTIONS} className={styles.select} onChange={handleChange} />
      </div>
      {renderNextItem({
        levelName,
        //@ts-ignore
        typeStructure: isNone ? null : value,
      })}
    </Fieldset>
  );
};

export { OptionItem };
