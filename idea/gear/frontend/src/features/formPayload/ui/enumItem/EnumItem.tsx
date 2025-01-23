import { useState, useMemo, ChangeEvent } from 'react';
import { Select } from '@gear-js/ui';
import { useFormContext } from 'react-hook-form';

import { useChangeEffect } from '@/hooks';
import { Fieldset } from '@/shared/ui';

import { PayloadItemProps } from '../../model';
import { getItemLabel, getNextLevelName, getPayloadValue } from '../../helpers';

const EnumItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const { name, type } = typeStructure;

  const options = useMemo(() => Object.keys(type).map((key) => ({ value: key, label: key })), [type]);

  const { setValue } = useFormContext();
  const [selected, setSelected] = useState(options[0].value);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => setSelected(event.target.value);

  const itemLabel = getItemLabel(name, title);
  const nextLevelName = getNextLevelName(levelName, selected);

  useChangeEffect(() => {
    // TODO: fix any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsedStructure = getPayloadValue(type[selected]);

    setValue(levelName, { [selected]: parsedStructure });
  }, [selected]);

  return (
    <Fieldset legend={itemLabel}>
      <Select options={options} onChange={handleChange} />
      {renderNextItem({
        levelName: nextLevelName,
        // @ts-expect-error - TODO(#1737): fix any
        typeStructure: type[selected],
      })}
    </Fieldset>
  );
};

export { EnumItem };
