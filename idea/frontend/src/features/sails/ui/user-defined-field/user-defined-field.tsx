import { Fieldset } from '@/shared/ui';

import { TypeDef } from '../../types';
import { Sails } from 'sails-js';

type Props = {
  def: TypeDef;
  sails: Sails;
  renderField: (def: TypeDef) => JSX.Element | undefined;
};

function UserDefinedField({ def, sails, renderField }: Props) {
  const { name } = def.asUserDefined;

  return <Fieldset legend={name}>{renderField(sails.getTypeDef(name))}</Fieldset>;
}

export { UserDefinedField };
