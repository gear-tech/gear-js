import { useState } from 'react';

import { useSetPayloadValue } from '../../hooks';
import type { LegacyFieldProps } from '../../types/legacy-field-props';
import { getLegacyLabel } from '../../utils/legacy-field';
import { getLegacyDefaultValue } from '../../utils/payload/legacy-get-default-payload-value';

const OPTIONS = [
  { label: 'None', value: 0 },
  { label: 'Some', value: 1 },
];

function OptionalField({ sails, def, name, label, render, renderField }: LegacyFieldProps) {
  const optionalDef = def.asOptional.def;

  const [isSome, setIsSome] = useState(OPTIONS[0].value);
  useSetPayloadValue(name, isSome ? getLegacyDefaultValue(sails)(optionalDef) : null, isSome);

  return render.ui.fieldset({
    legend: getLegacyLabel(label, def),

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
