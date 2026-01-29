import { FieldProps } from '../types';
import { getLabel } from '../utils';

function PrimitiveField({ def, name, label, render }: FieldProps) {
  const props = { name, label: getLabel(label, def) };

  if (def.asPrimitive.isBool) return render.rhf.checkbox(props);

  return render.rhf.input(props);
}

export { PrimitiveField };
