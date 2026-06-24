import type { LegacyFieldProps } from '../../types/legacy-field-props';
import { getLegacyLabel } from '../../utils/legacy-field';

function UserDefinedField({ def, sails, name, label, render, renderField }: LegacyFieldProps) {
  const defName = def.asUserDefined.name;

  return render.ui.fieldset({
    legend: getLegacyLabel(label, def),
    children: renderField(sails.getTypeDef(defName), '', name),
  });
}

export { UserDefinedField };
