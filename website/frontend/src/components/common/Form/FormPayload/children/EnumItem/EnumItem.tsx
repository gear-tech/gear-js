import { useState, useMemo, ChangeEvent } from 'react';
import { useField } from 'formik';
import { Select } from '@gear-js/ui';

import styles from '../../FormPayload.module.scss';
import { PayloadItemProps } from '../../types';
import { getItemLabel, getNextLevelName, getPayloadValue } from '../../helpers';

import { useChangeEffect } from 'hooks';
import { Fieldset } from 'components/common/Fieldset';

const EnumItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const { name, value } = typeStructure;

  const options = useMemo(() => Object.keys(value).map((key) => ({ value: key, label: key })), [value]);

  const [, , helpers] = useField(levelName);
  const [selected, setSelected] = useState(options[0].value);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => setSelected(event.target.value);

  const itemLabel = getItemLabel(name, title);
  const nextLevelName = getNextLevelName(levelName, selected);

  useChangeEffect(() => {
    // @ts-ignore
    const parsedStructure = getPayloadValue(value[selected]);

    helpers.setValue({ [selected]: parsedStructure }, false);
  }, [selected]);

  return (
    <Fieldset legend={itemLabel} className={styles.fieldset}>
      <Select options={options} className={styles.select} onChange={handleChange} />
      {renderNextItem({
        levelName: nextLevelName,
        // @ts-ignore
        typeStructure: value[selected],
      })}
    </Fieldset>
  );
};

export { EnumItem };
