import { useState } from 'react';

import { useSetPayloadValue } from '../hooks';
import type { FieldProps } from '../types';
import { getDefaultValue, getLabel } from '../utils';
import { isOption } from '../utils/type-decl';

const OPTIONS = [
  { label: 'None', value: 0 },
  { label: 'Some', value: 1 },
];

function OptionalField({ program, serviceName, def, name, label, render, renderField }: FieldProps) {
  if (!isOption(def)) throw new Error('Expected Option type');

  const optionalDef = def.generics![0];

  const [isSome, setIsSome] = useState(OPTIONS[0].value);
  useSetPayloadValue(name, isSome ? getDefaultValue(program, serviceName)(optionalDef) : null, isSome);

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
