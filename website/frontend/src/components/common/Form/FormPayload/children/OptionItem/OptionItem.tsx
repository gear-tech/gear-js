import { useState, ChangeEvent, useMemo } from 'react';
import { useField } from 'formik';
import { Select } from '@gear-js/ui';

import styles from '../../FormPayload.module.scss';
import { OPTION_OPTIONS, DEFAULT_VALUE } from './const';
import { PayloadItemProps } from '../../types';
import { getItemLabel, getPayloadValue } from '../../helpers';

import { useChangeEffect } from 'hooks';
import { Fieldset } from 'components/common/Fieldset';

const OptionItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const { name, value } = typeStructure;

  const [, , helpers] = useField(levelName);
  const [selected, setSelected] = useState(DEFAULT_VALUE);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => setSelected(event.target.value);

  const parsedPayload = useMemo(() => getPayloadValue(value as any), [value]);

  const isNone = selected === DEFAULT_VALUE;
  const itemLabel = getItemLabel(name, title);

  useChangeEffect(() => {
    const fieldValue = isNone ? null : parsedPayload;

    helpers.setValue(fieldValue, false);
  }, [isNone]);

  return (
    <Fieldset legend={itemLabel} className={styles.fieldset}>
      <Select options={OPTION_OPTIONS} className={styles.select} onChange={handleChange} />
      {renderNextItem({
        levelName,
        // @ts-ignore
        typeStructure: isNone ? null : value,
      })}
    </Fieldset>
  );
};

export { OptionItem };
