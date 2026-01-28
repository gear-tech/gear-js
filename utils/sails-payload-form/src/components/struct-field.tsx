import { FieldProps } from '../types';
import { getLabel, getNestedName } from '../utils';

function StructField({ def, name, label, render, renderField }: FieldProps) {
  const { fields } = def.asStruct;

  const renderFields = () =>
    fields.map((field, index) =>
      renderField(field.def, field.name, getNestedName(name, field.name || index.toString())),
    );

  // not sure if label should refer to fieldset display
  return label ? render.ui.fieldset({ legend: getLabel(label, def), children: renderFields() }) : renderFields();
}

export { StructField };
