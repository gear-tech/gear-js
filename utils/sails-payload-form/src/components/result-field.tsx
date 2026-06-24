import { useState } from 'react';

import { RESULT } from '../consts';
import { useSetPayloadValue } from '../hooks';
import type { FieldProps, Result } from '../types';
import { getDefaultValue, getLabel, getNestedName } from '../utils';
import { isResult } from '../utils/type-decl';

const OPTIONS = [
  { label: 'Ok', value: RESULT.OK },
  { label: 'Err', value: RESULT.ERR },
] as const;

function ResultField({ program, serviceName, def, name, label, render, renderField }: FieldProps) {
  if (!isResult(def)) throw new Error('Expected Result type');

  const [result, setResult] = useState<Result>(OPTIONS[0].value);
  const resultDef = def.generics![result === RESULT.OK ? 0 : 1];

  useSetPayloadValue(name, { [result]: getDefaultValue(program, serviceName)(resultDef) }, result);

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
