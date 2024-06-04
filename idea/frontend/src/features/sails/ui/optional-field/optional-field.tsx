import { Select } from '@gear-js/ui';
import { useState } from 'react';

import { Fieldset } from '@/shared/ui';

import { OptionalDef, TypeDef } from '../../types';

type Props = {
  def: OptionalDef;
  name: string;
  renderField: (def: TypeDef) => JSX.Element | undefined;
};

const OPTIONS = [
  { label: 'None', value: 0 },
  { label: 'Some', value: 1 },
];

function OptionalField({ def, name, renderField }: Props) {
  const [isSome, setIsSome] = useState(OPTIONS[0].value);

  return (
    <Fieldset legend={name}>
      <Select options={OPTIONS} value={isSome} onChange={({ target }) => setIsSome(Number(target.value))} />

      {Boolean(isSome) && renderField(def.def)}
    </Fieldset>
  );
}

export { OptionalField };
