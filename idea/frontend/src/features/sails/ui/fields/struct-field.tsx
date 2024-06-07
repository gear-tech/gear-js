import { Fieldset } from '@/shared/ui';

import { TypeDef } from '../../types';
import { getLabel, getNestedName } from '../../utils';

type Props = {
  def: TypeDef;
  name: string;
  label: string;
  renderField: (def: TypeDef, label: string, name: string) => JSX.Element | undefined;
};

function StructField({ def, name, label, renderField }: Props) {
  const { fields } = def.asStruct;

  const renderFields = () =>
    fields.map((field, index) =>
      renderField(field.def, field.name, getNestedName(name, field.name || index.toString())),
    );

  // not sure if label should refer to fieldset display
  return label ? <Fieldset legend={getLabel(label, def)}>{renderFields()}</Fieldset> : renderFields();
}

export { StructField };
