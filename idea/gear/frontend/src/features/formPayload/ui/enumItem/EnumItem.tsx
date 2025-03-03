import { Select } from '@gear-js/ui';
import { useState, useMemo, ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';

import { useChangeEffect } from '@/hooks';
import { Fieldset } from '@/shared/ui';

import { getItemLabel, getNextLevelName, getPayloadValue } from '../../helpers';
import { PayloadItemProps } from '../../model';

const EnumItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const { name, type } = typeStructure;

  const options = useMemo(() => Object.keys(type).map((key) => ({ value: key, label: key })), [type]);

  const { setValue } = useFormContext();
  const [selected, setSelected] = useState(options[0].value);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => setSelected(event.target.value);

  const itemLabel = getItemLabel(name, title);
  const nextLevelName = getNextLevelName(levelName, selected);

  useChangeEffect(() => {
    const parsedStructure = getPayloadValue(type[selected as keyof typeof type]);

    setValue(levelName, { [selected]: parsedStructure });
  }, [selected]);

  return (
    <Fieldset legend={itemLabel}>
      <Select options={options} onChange={handleChange} />
      {renderNextItem({
        levelName: nextLevelName,
        // @ts-expect-error - TODO(#1737): fix any
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
        typeStructure: type[selected],
      })}
    </Fieldset>
  );
};

export { EnumItem };
