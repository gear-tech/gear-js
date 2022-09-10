import { useState, ChangeEvent, useMemo } from 'react';
import { useField } from 'formik';
import { Select } from '@gear-js/ui';

import { useChangeEffect } from 'hooks';
import { Fieldset } from 'shared/ui/fieldset';

import styles from '../FormPayload.module.scss';
import { OPTION_ITEM_OPTIONS, DEFAULT_OPTION_VALUE } from '../../model/consts';
import { PayloadItemProps } from '../../model/types';
import { getItemLabel, getPayloadValue } from '../../helpers';

const OptionItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const { name, value } = typeStructure;

  const [, , helpers] = useField(levelName);
  const [selected, setSelected] = useState(DEFAULT_OPTION_VALUE);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => setSelected(event.target.value);

  const parsedPayload = useMemo(() => getPayloadValue(value as any), [value]);

  const isNone = selected === DEFAULT_OPTION_VALUE;
  const itemLabel = getItemLabel(name, title);

  useChangeEffect(() => {
    const fieldValue = isNone ? null : parsedPayload;

    helpers.setError(undefined);
    helpers.setValue(fieldValue, false);
  }, [isNone]);

  return (
    <Fieldset legend={itemLabel} className={styles.fieldset}>
      <Select options={OPTION_ITEM_OPTIONS} className={styles.select} onChange={handleChange} />
      {renderNextItem({
        levelName,
        // @ts-ignore
        typeStructure: isNone ? null : value,
      })}
    </Fieldset>
  );
};

export { OptionItem };
