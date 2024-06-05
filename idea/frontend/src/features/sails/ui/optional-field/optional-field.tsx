import { Select } from '@gear-js/ui';
import { useState } from 'react';

import { Fieldset } from '@/shared/ui';

import { TypeDef } from '../../types';
import { getLabel, getType } from '../../utils';

type Props = {
  def: TypeDef;
  name: string;
  renderField: (def: TypeDef) => JSX.Element | undefined;
};

const OPTIONS = [
  { label: 'None', value: 0 },
  { label: 'Some', value: 1 },
];

function OptionalField({ def, name, renderField }: Props) {
  const [isSome, setIsSome] = useState(OPTIONS[0].value);
  const label = getLabel(name, getType(def));

  return (
    <Fieldset legend={label}>
      <Select options={OPTIONS} value={isSome} onChange={({ target }) => setIsSome(Number(target.value))} />

      {Boolean(isSome) && renderField(def.asOptional.def)}
    </Fieldset>
  );
}

export { OptionalField };
