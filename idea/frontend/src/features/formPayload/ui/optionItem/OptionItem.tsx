import { useState, ChangeEvent, useMemo } from 'react';
import { useForm } from 'react-final-form';
import { Select } from '@gear-js/ui';

import { useChangeEffect } from '@/hooks';
import { Fieldset } from '@/shared/ui/fieldset';

import { getItemLabel, getPayloadValue } from '../../helpers';
import { PayloadItemProps, OPTION_ITEM_OPTIONS, DEFAULT_OPTION_VALUE } from '../../model';

const OptionItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const { name, type } = typeStructure;

  const { change } = useForm();
  const [selected, setSelected] = useState(DEFAULT_OPTION_VALUE);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => setSelected(event.target.value);

  const parsedPayload = useMemo(() => getPayloadValue(type as any), [type]);

  const isNone = selected === DEFAULT_OPTION_VALUE;
  const itemLabel = getItemLabel(name, title);

  useChangeEffect(() => {
    const fieldValue = isNone ? null : parsedPayload;

    change(levelName, fieldValue);
  }, [isNone]);

  return (
    <Fieldset legend={itemLabel}>
      <Select options={OPTION_ITEM_OPTIONS} onChange={handleChange} />
      {renderNextItem({
        levelName,
        // @ts-ignore
        typeStructure: isNone ? null : type.Some,
      })}
    </Fieldset>
  );
};

export { OptionItem };
