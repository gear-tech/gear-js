import { Fieldset } from '@/shared/ui/fieldset';

import { UserDefinedDef } from '../../types';

type Props = {
  def: UserDefinedDef;
};

function UserDefinedField({ def }: Props) {
  const { name } = def;

  return <Fieldset legend={name}>user</Fieldset>;
}

export { UserDefinedField };
