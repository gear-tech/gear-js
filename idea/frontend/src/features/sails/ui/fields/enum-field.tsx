import { Select } from '@gear-js/ui';
import { useState } from 'react';
import { Sails, TypeDef } from 'sails-js';

import { useSetPayloadValue } from '../../hooks';
import { getNestedName, getDefaultValue } from '../../utils';

type Props = {
  sails: Sails;
  def: TypeDef;
  name: string;
  renderField: (def: TypeDef, label: string, name: string) => JSX.Element | undefined;
};

function EnumField({ sails, def, name, renderField }: Props) {
  const { variants } = def.asEnum;
  const options = variants.map((variant, index) => ({ label: variant.name, value: index }));

  const [variantIndex, setVariantIndex] = useState(options[0].value);
  const variant = variants[variantIndex];

  useSetPayloadValue(name, { [variant.name]: variant.def ? getDefaultValue(sails)(variant.def) : null }, variantIndex);

  return (
    <>
      <Select options={options} value={variantIndex} onChange={({ target }) => setVariantIndex(Number(target.value))} />

      {renderField(variant.def, '', getNestedName(name, variant.name))}
    </>
  );
}

export { EnumField };
