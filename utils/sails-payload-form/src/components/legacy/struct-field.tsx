import type { LegacyFieldProps } from '../../types/legacy-field-props';
import { getLegacyLabel, getNestedName } from '../../utils/legacy-field';

function StructField({ def, name, label, render, renderField }: LegacyFieldProps) {
  const { fields } = def.asStruct;

  const renderFields = () =>
    fields.map((field, index) =>
      renderField(field.def, field.name, getNestedName(name, field.name || index.toString())),
    );

  return label ? render.ui.fieldset({ legend: getLegacyLabel(label, def), children: renderFields() }) : renderFields();
}

export { StructField };
