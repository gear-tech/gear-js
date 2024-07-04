import { Select } from '@gear-js/ui';
import { useState } from 'react';
import { Sails, TypeDef } from 'sails-js';

import { Fieldset } from '@/shared/ui';

import { RESULT } from '../../consts';
import { useSetPayloadValue } from '../../hooks';
import { Result } from '../../types';
import { getDefaultValue, getLabel, getNestedName } from '../../utils';

type Props = {
  sails: Sails;
  def: TypeDef;
  name: string;
  label: string;
  renderField: (def: TypeDef, label: string, name: string) => JSX.Element | undefined;
};

const OPTIONS = [
  { label: 'Ok', value: RESULT.OK },
  { label: 'Err', value: RESULT.ERR },
] as const;

function ResultField({ sails, def, name, label, renderField }: Props) {
  const [result, setResult] = useState<Result>(OPTIONS[0].value);
  const resultDef = def.asResult[result].def;

  useSetPayloadValue(name, { [result]: getDefaultValue(sails)(resultDef) }, result);

  return (
    <Fieldset legend={getLabel(label, def)}>
      <Select options={OPTIONS} value={result} onChange={({ target }) => setResult(target.value as Result)} />

      {renderField(resultDef, '', getNestedName(name, result))}
    </Fieldset>
  );
}

export { ResultField };
