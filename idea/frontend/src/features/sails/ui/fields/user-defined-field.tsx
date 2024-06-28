import { Sails } from 'sails-js';

import { Fieldset } from '@/shared/ui';

import { TypeDef } from '../../types';
import { getLabel } from '../../utils';

type Props = {
  def: TypeDef;
  sails: Sails;
  name: string;
  label: string;
  renderField: (def: TypeDef, label: string, name: string) => JSX.Element | undefined;
};

function UserDefinedField({ def, sails, name, label, renderField }: Props) {
  const defName = def.asUserDefined.name;

  return <Fieldset legend={getLabel(label, def)}>{renderField(sails.getTypeDef(defName), '', name)}</Fieldset>;
}

export { UserDefinedField };
