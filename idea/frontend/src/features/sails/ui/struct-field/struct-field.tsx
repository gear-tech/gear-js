import { StructDef, TypeDef } from '../../types';

type Props = {
  def: StructDef;
  renderField: (def: TypeDef, label: string) => JSX.Element | undefined;
};

function StructField({ def, renderField }: Props) {
  const { fields } = def;

  // TODO: specify keys?
  const renderFields = () => fields.map((field) => renderField(field.def, field.name));

  return renderFields();
}

export { StructField };
