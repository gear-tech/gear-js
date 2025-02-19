import { Select } from '@gear-js/ui';
import { useState, ChangeEvent, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { useChangeEffect } from '@/hooks';
import { Fieldset } from '@/shared/ui';

import { getItemLabel, getPayloadValue } from '../../helpers';
import { PayloadItemProps, OPTION_ITEM_OPTIONS, DEFAULT_OPTION_VALUE } from '../../model';

const OptionItem = ({ title, levelName, typeStructure, renderNextItem }: PayloadItemProps) => {
  const { name, type } = typeStructure;

  const { setValue } = useFormContext();
  const [selected, setSelected] = useState(DEFAULT_OPTION_VALUE);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => setSelected(event.target.value);

  // @ts-expect-error - TODO(#1737): fix any
  const parsedPayload = useMemo(() => getPayloadValue(type), [type]);

  const isNone = selected === DEFAULT_OPTION_VALUE;
  const itemLabel = getItemLabel(name, title);

  useChangeEffect(() => {
    const fieldValue = isNone ? null : parsedPayload;

    setValue(levelName, fieldValue);
  }, [isNone]);

  return (
    <Fieldset legend={itemLabel}>
      <Select options={OPTION_ITEM_OPTIONS} onChange={handleChange} />
      {renderNextItem({
        levelName,
        // @ts-expect-error - TODO: fix Property 'Some' does not exist on type 'string'
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
        typeStructure: isNone ? null : type.Some,
      })}
    </Fieldset>
  );
};

export { OptionItem };
