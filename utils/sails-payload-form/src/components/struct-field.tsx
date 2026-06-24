import type { FieldProps } from '../types';
import { getLabel, getNestedName } from '../utils';
import { isTuple } from '../utils/type-decl';

function StructField({ def, resolvedType, name, label, render, renderField }: FieldProps) {
  const fields =
    resolvedType?.kind === 'struct'
      ? resolvedType.fields
      : isTuple(def)
        ? def.types.map((type, index) => ({ name: index.toString(), type }))
        : [];

  const renderFields = () =>
    fields.map((field, index) =>
      renderField(field.type, field.name || '', getNestedName(name, field.name || index.toString())),
    );

  return label
    ? render.ui.fieldset({ legend: getLabel(label, def, resolvedType), children: renderFields() })
    : renderFields();
}

export { StructField };
