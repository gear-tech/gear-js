import type { LegacyFieldProps } from '../../types/legacy-field-props';
import { getLegacyLabel, getNestedName } from '../../utils/legacy-field';

function FixedSizeArrayField({ def, name, label, render, renderField }: LegacyFieldProps) {
  const arrayDef = def.asFixedSizeArray;

  const renderFields = () =>
    new Array<typeof arrayDef>(arrayDef.len)
      .fill(arrayDef)
      .map((field, index) => renderField(field.def, '', getNestedName(name, index.toString())));

  return render.ui.fieldset({ legend: getLegacyLabel(label, def), children: renderFields() });
}

export { FixedSizeArrayField };
