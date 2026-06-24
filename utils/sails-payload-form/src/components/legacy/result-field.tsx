import { useState } from 'react';

import { RESULT } from '../../consts';
import { useSetPayloadValue } from '../../hooks';
import type { Result } from '../../types';
import type { LegacyFieldProps } from '../../types/legacy-field-props';
import { getLegacyLabel, getNestedName } from '../../utils/legacy-field';
import { getLegacyDefaultValue } from '../../utils/payload/legacy-get-default-payload-value';

const OPTIONS = [
  { label: 'Ok', value: RESULT.OK },
  { label: 'Err', value: RESULT.ERR },
] as const;

function ResultField({ sails, def, name, label, render, renderField }: LegacyFieldProps) {
  const [result, setResult] = useState<Result>(OPTIONS[0].value);
  const resultDef = def.asResult[result].def;

  useSetPayloadValue(name, { [result]: getLegacyDefaultValue(sails)(resultDef) }, result);

  return render.ui.fieldset({
    legend: getLegacyLabel(label, def),

    children: (
      <>
        {render.ui.select({
          options: OPTIONS,
          value: result,
          onChange: ({ target }) => setResult(target.value as Result),
        })}

        {renderField(resultDef, '', getNestedName(name, result))}
      </>
    ),
  });
}

export { ResultField };
