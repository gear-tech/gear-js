import { Sails } from 'sails-js';

import { Fieldset } from '@/shared/ui';

import { TypeDef } from '../../types';

type Props = {
  def: TypeDef;
  sails: Sails;
  name: string;
  renderField: (def: TypeDef, label: string, name: string) => JSX.Element | undefined;
};

function UserDefinedField({ def, sails, name, renderField }: Props) {
  const defName = def.asUserDefined.name;

  return <Fieldset legend={defName}>{renderField(sails.getTypeDef(defName), '', name)}</Fieldset>;
}

export { UserDefinedField };
