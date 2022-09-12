import { useState, useMemo, ChangeEvent } from 'react';
import { useForm } from 'react-final-form';
import { Select } from '@gear-js/ui';

import { useChangeEffect } from 'hooks';
import { Fieldset } from 'shared/ui/fieldset';

import styles from '../FormPayload.module.scss';
import { PayloadItemProps } from '../../model';
import { getItemLabel, getNextLevelName, getPayloadValue } from '../../helpers';

const EnumItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const { name, value } = typeStructure;

  const options = useMemo(() => Object.keys(value).map((key) => ({ value: key, label: key })), [value]);

  const { change } = useForm(levelName);
  const [selected, setSelected] = useState(options[0].value);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => setSelected(event.target.value);

  const itemLabel = getItemLabel(name, title);
  const nextLevelName = getNextLevelName(levelName, selected);

  useChangeEffect(() => {
    // @ts-ignore
    const parsedStructure = getPayloadValue(value[selected]);

    change(levelName, { [selected]: parsedStructure });
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
