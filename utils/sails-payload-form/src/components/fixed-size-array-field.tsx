import type { FieldProps } from '../types';
import { getLabel, getNestedName } from '../utils';
import { isFixedSizeArray } from '../utils/type-decl';

function FixedSizeArrayField({ def, name, label, render, renderField }: FieldProps) {
  if (!isFixedSizeArray(def)) throw new Error('Expected array type');

  const renderFields = () =>
    new Array(def.len).fill(null).map((_, index) => renderField(def.item, '', getNestedName(name, index.toString())));

  return render.ui.fieldset({ legend: getLabel(label, def), children: renderFields() });
}

export { FixedSizeArrayField };
