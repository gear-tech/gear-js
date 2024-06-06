import { Select } from '@gear-js/ui';
import { useState } from 'react';

import { Fieldset } from '@/shared/ui';

import { TypeDef } from '../../types';
import { getLabel, getNestedName } from '../../utils';

type Props = {
  def: TypeDef;
  name: string;
  label: string;
  renderField: (def: TypeDef, label: string, name: string) => JSX.Element | undefined;
};

const OPTIONS = [
  { label: 'Ok', value: 'ok' },
  { label: 'Err', value: 'err' },
] as const;

type Result = typeof OPTIONS[number]['value'];

function ResultField({ def, name, label, renderField }: Props) {
  const [result, setResult] = useState<Result>(OPTIONS[0].value);

  return (
    <Fieldset legend={getLabel(label, def)}>
      <Select options={OPTIONS} value={result} onChange={({ target }) => setResult(target.value as Result)} />

      {renderField(def.asResult[result].def, '', getNestedName(name, result))}
    </Fieldset>
  );
}

export { ResultField };
