import { TypeDef } from '../../types';
import { getNestedName } from '../../utils';

type Props = {
  def: TypeDef;
  name: string;
  renderField: (def: TypeDef, label: string, name: string) => JSX.Element | undefined;
};

function StructField({ def, name, renderField }: Props) {
  const { fields } = def.asStruct;

  // TODO: consider tuple
  const renderFields = () => fields.map((field) => renderField(field.def, field.name, getNestedName(name, field.name)));

  return renderFields();
}

export { StructField };
