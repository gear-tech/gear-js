import { Fieldset } from '@/shared/ui';

import { UserDefinedDef } from '../../types';

type Props = {
  def: UserDefinedDef;
  renderField: () => JSX.Element | undefined;
};

function UserDefinedField({ def, renderField }: Props) {
  const { name } = def;

  return <Fieldset legend={name}>{renderField()}</Fieldset>;
}

export { UserDefinedField };
