import { Select } from '@gear-js/ui';
import { useState } from 'react';
import { Sails } from 'sails-js';
import { ISailsTypeDef } from 'sails-js-types';

import { Fieldset } from '@/shared/ui';

import { RESULT } from '../../consts';
import { useSetPayloadValue } from '../../hooks';
import { Result } from '../../types';
import { getDefaultValue, getLabel, getNestedName } from '../../utils';

type Props = {
  sails: Sails;
  def: ISailsTypeDef;
  name: string;
  label: string;
  renderField: (def: ISailsTypeDef, label: string, name: string) => JSX.Element | undefined;
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
