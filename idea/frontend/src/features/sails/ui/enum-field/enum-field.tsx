import { Select } from '@gear-js/ui';
import { useState } from 'react';

import { EnumDef, TypeDef } from '../../types';

type Props = {
  def: EnumDef;
  renderField: (def: TypeDef) => JSX.Element | undefined;
};

function EnumField({ def, renderField }: Props) {
  const { variants } = def;
  const options = variants.map(({ name }, index) => ({ label: name, value: index }));

  const [variantIndex, setVariantIndex] = useState(options[0].value);
  const variant = variants[variantIndex];

  return (
    <>
      <Select options={options} value={variantIndex} onChange={({ target }) => setVariantIndex(Number(target.value))} />

      {renderField(variant.def)}
    </>
  );
}

export { EnumField };
