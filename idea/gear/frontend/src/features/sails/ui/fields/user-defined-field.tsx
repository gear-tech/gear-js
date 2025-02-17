import { JSX } from 'react';
import { Sails } from 'sails-js';
import { ISailsTypeDef } from 'sails-js-types';

import { Fieldset } from '@/shared/ui';

import { getLabel } from '../../utils';

type Props = {
  def: ISailsTypeDef;
  sails: Sails;
  name: string;
  label: string;
  renderField: (def: ISailsTypeDef, label: string, name: string) => JSX.Element | undefined;
};

function UserDefinedField({ def, sails, name, label, renderField }: Props) {
  const defName = def.asUserDefined.name;

  return <Fieldset legend={getLabel(label, def)}>{renderField(sails.getTypeDef(defName), '', name)}</Fieldset>;
}

export { UserDefinedField };
