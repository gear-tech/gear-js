import type { LegacyFieldProps } from '../../types/legacy-field-props';
import { getLegacyLabel } from '../../utils/legacy-field';

function PrimitiveField({ def, name, label, render }: LegacyFieldProps) {
  if (def.asPrimitive.isBool) return render.rhf.checkbox({ name, label: getLegacyLabel(label, def) });

  return render.rhf.input({ name, label: getLegacyLabel(label, def) });
}

export { PrimitiveField };
