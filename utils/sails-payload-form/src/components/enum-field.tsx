import { useState } from 'react';

import { useSetPayloadValue } from '../hooks';
import { FieldProps } from '../types';
import { getNestedName, getDefaultValue } from '../utils';

function EnumField({ sails, def, name, render, renderField }: FieldProps) {
  const { variants } = def.asEnum;
  const options = variants.map((variant, index) => ({ label: variant.name, value: index }));

  const [variantIndex, setVariantIndex] = useState(options[0].value);
  const variant = variants[variantIndex];

  useSetPayloadValue(name, { [variant.name]: variant.def ? getDefaultValue(sails)(variant.def) : null }, variantIndex);

  return (
    <>
      {render.ui.select({
        options,
        value: variantIndex,
        onChange: ({ target }) => setVariantIndex(Number(target.value)),
      })}

      {renderField(variant.def, '', getNestedName(name, variant.name))}
    </>
  );
}

export { EnumField };
