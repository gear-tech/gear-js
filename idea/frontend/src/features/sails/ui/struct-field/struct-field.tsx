import { Fieldset } from '@/shared/ui';

import { StructDef, TypeDef } from '../../types';

type Props = {
  def: StructDef;
  renderField: (def: TypeDef) => JSX.Element | undefined;
};

function StructField({ def, renderField }: Props) {
  const { fields } = def;

  // TODO: specify keys?
  const renderFields = () => fields.map((field) => renderField(field.def));

  return <Fieldset legend={'Struct Field'}>{renderFields()}</Fieldset>;
}

export { StructField };
