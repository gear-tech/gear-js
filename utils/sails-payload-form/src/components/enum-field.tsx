import { useState } from 'react';

import { useSetPayloadValue } from '../hooks';
import type { FieldProps } from '../types';
import { getDefaultValue, getNestedName } from '../utils';

function EnumField({ program, serviceName, resolvedType, name, render, renderField }: FieldProps) {
  if (!resolvedType || resolvedType.kind !== 'enum') throw new Error('Enum type is not resolved');

  const { variants } = resolvedType;
  const options = variants.map((variant, index) => ({
    label: variant.name,
    value: index,
  }));

  const [variantIndex, setVariantIndex] = useState(options[0].value);
  const variant = variants[variantIndex];

  const getVariantDefault = () => {
    if (!variant.fields.length) return null;

    if (variant.fields.length === 1) return getDefaultValue(program, serviceName)(variant.fields[0].type);

    const fields = variant.fields.map(
      ({ name: fieldName, type }, index) => [fieldName || index, getDefaultValue(program, serviceName)(type)] as const,
    );

    return Object.fromEntries(fields);
  };

  useSetPayloadValue(name, { [variant.name]: getVariantDefault() }, variantIndex);

  return (
    <>
      {render.ui.select({
        options,
        value: variantIndex,
        onChange: ({ target }) => setVariantIndex(Number(target.value)),
      })}

      {variant.fields.length === 1 && renderField(variant.fields[0].type, '', getNestedName(name, variant.name))}

      {variant.fields.length > 1 &&
        variant.fields.map((field, index) =>
          renderField(field.type, field.name || '', getNestedName(name, `${variant.name}.${field.name || index}`)),
        )}
    </>
  );
}

export { EnumField };
