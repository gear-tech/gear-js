import { useState } from 'react';

import { useSetPayloadValue } from '../hooks';
import { FieldProps } from '../types';
import { getDefaultValue, getLabel } from '../utils';

const OPTIONS = [
  { label: 'None', value: 0 },
  { label: 'Some', value: 1 },
];

function OptionalField({ sails, def, name, label, render, renderField }: FieldProps) {
  const optionalDef = def.asOptional.def;

  const [isSome, setIsSome] = useState(OPTIONS[0].value);
  useSetPayloadValue(name, isSome ? getDefaultValue(sails)(optionalDef) : null, isSome);

  return render.ui.fieldset({
    legend: getLabel(label, def),

    children: (
      <>
        {render.ui.select({
          options: OPTIONS,
          value: isSome,
          onChange: ({ target }) => setIsSome(Number(target.value)),
        })}

        {Boolean(isSome) && renderField(optionalDef, '', name)}
      </>
    ),
  });
}

export { OptionalField };
