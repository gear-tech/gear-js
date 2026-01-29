import { useState } from 'react';

import { RESULT } from '../consts';
import { useSetPayloadValue } from '../hooks';
import { FieldProps, Result } from '../types';
import { getDefaultValue, getLabel, getNestedName } from '../utils';

const OPTIONS = [
  { label: 'Ok', value: RESULT.OK },
  { label: 'Err', value: RESULT.ERR },
] as const;

function ResultField({ sails, def, name, label, render, renderField }: FieldProps) {
  const [result, setResult] = useState<Result>(OPTIONS[0].value);
  const resultDef = def.asResult[result].def;

  useSetPayloadValue(name, { [result]: getDefaultValue(sails)(resultDef) }, result);

  return render.ui.fieldset({
    legend: getLabel(label, def),

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
