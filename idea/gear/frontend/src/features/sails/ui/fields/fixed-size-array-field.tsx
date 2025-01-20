import { ISailsTypeDef } from 'sails-js-types';

import { Fieldset } from '@/shared/ui';

import { getLabel, getNestedName } from '../../utils';

type Props = {
  def: ISailsTypeDef;
  name: string;
  label: string;
  renderField: (def: ISailsTypeDef, name: string, label: string) => JSX.Element | undefined;
};

function FixedSizeArrayField({ def, name, label, renderField }: Props) {
  const arrayDef = def.asFixedSizeArray;

  const renderFields = () =>
    new Array<typeof arrayDef>(arrayDef.len)
      .fill(arrayDef)
      .map((field, index) => renderField(field.def, '', getNestedName(name, index.toString())));

  return <Fieldset legend={getLabel(label, def)}>{renderFields()}</Fieldset>;
}

export { FixedSizeArrayField };
