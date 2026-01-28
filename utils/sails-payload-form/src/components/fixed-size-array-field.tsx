import { FieldProps } from '../types';
import { getLabel, getNestedName } from '../utils';

function FixedSizeArrayField({ def, name, label, render, renderField }: FieldProps) {
  const arrayDef = def.asFixedSizeArray;

  const renderFields = () =>
    new Array<typeof arrayDef>(arrayDef.len)
      .fill(arrayDef)
      .map((field, index) => renderField(field.def, '', getNestedName(name, index.toString())));

  return render.ui.fieldset({ legend: getLabel(label, def), children: renderFields() });
}

export { FixedSizeArrayField };
