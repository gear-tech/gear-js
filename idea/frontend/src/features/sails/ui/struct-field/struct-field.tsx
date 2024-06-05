import { TypeDef } from '../../types';

type Props = {
  def: TypeDef;
  renderField: (def: TypeDef, name: string) => JSX.Element | undefined;
};

function StructField({ def, renderField }: Props) {
  const { fields } = def.asStruct;

  // TODO: specify keys?
  const renderFields = () => fields.map((field) => renderField(field.def, field.name));

  return renderFields();
}

export { StructField };
