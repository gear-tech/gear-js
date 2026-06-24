import type { FieldProps } from '../types';
import { getLabel } from '../utils';
import { isBool } from '../utils/type-decl';

function PrimitiveField({ def, name, label, render }: FieldProps) {
  const props = { name, label: getLabel(label, def) };

  if (isBool(def)) return render.rhf.checkbox(props);

  return render.rhf.input(props);
}

export { PrimitiveField };
