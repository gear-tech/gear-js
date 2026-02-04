import { FieldProps } from '../types';
import { getLabel } from '../utils';

function UserDefinedField({ def, sails, name, label, render, renderField }: FieldProps) {
  const defName = def.asUserDefined.name;

  return render.ui.fieldset({
    legend: getLabel(label, def),
    children: renderField(sails.getTypeDef(defName), '', name),
  });
}

export { UserDefinedField };
