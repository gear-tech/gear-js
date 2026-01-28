import { FieldProps } from '../types';
import { getLabel } from '../utils';

function VecField({ def, name, label, render }: FieldProps) {
  return render.rhf.textarea({ name, label: getLabel(label, def) });
}

export { VecField };
