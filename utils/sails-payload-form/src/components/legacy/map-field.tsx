import type { LegacyFieldProps } from '../../types/legacy-field-props';
import { getLegacyLabel } from '../../utils/legacy-field';

function MapField({ def, name, label, render }: LegacyFieldProps) {
  return render.rhf.textarea({ name, label: getLegacyLabel(label, def) });
}

export { MapField };
