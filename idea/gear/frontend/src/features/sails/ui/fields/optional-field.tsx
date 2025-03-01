import { Select } from '@gear-js/ui';
import { useState, JSX } from 'react';
import { Sails } from 'sails-js';
import { ISailsTypeDef } from 'sails-js-types';

import { Fieldset } from '@/shared/ui';

import { useSetPayloadValue } from '../../hooks';
import { getDefaultValue, getLabel } from '../../utils';

type Props = {
  sails: Sails;
  def: ISailsTypeDef;
  name: string;
  label: string;
  renderField: (def: ISailsTypeDef, label: string, name: string) => JSX.Element | undefined;
};

const OPTIONS = [
  { label: 'None', value: 0 },
  { label: 'Some', value: 1 },
];

function OptionalField({ sails, def, name, label, renderField }: Props) {
  const optionalDef = def.asOptional.def;

  const [isSome, setIsSome] = useState(OPTIONS[0].value);
  useSetPayloadValue(name, isSome ? getDefaultValue(sails)(optionalDef) : null, isSome);

  return (
    <Fieldset legend={getLabel(label, def)}>
      <Select options={OPTIONS} value={isSome} onChange={({ target }) => setIsSome(Number(target.value))} />

      {Boolean(isSome) && renderField(optionalDef, '', name)}
    </Fieldset>
  );
}

export { OptionalField };
