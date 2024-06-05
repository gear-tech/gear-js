import { Select } from '@gear-js/ui';
import { useState } from 'react';

import { TypeDef } from '../../types';
import { getNestedName } from '../../utils';

type Props = {
  def: TypeDef;
  name: string;
  renderField: (def: TypeDef, label: string, name: string) => JSX.Element | undefined;
};

function EnumField({ def, name, renderField }: Props) {
  const { variants } = def.asEnum;
  const options = variants.map((variant, index) => ({ label: variant.name, value: index }));

  const [variantIndex, setVariantIndex] = useState(options[0].value);
  const variant = variants[variantIndex];

  return (
    <>
      <Select options={options} value={variantIndex} onChange={({ target }) => setVariantIndex(Number(target.value))} />

      {renderField(variant.def, '', getNestedName(name, variant.name))}
    </>
  );
}

export { EnumField };
