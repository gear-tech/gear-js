import { ISailsTypeDef } from 'sails-js-types';

import { Fieldset } from '@/shared/ui';

import { getLabel, getNestedName } from '../../utils';

type Props = {
  def: ISailsTypeDef;
  name: string;
  label: string;
  renderField: (def: ISailsTypeDef, label: string, name: string) => JSX.Element | undefined;
};

function StructField({ def, name, label, renderField }: Props) {
  const { fields } = def.asStruct;

  const renderFields = () =>
    fields.map((field, index) =>
      renderField(field.def, field.name, getNestedName(name, field.name || index.toString())),
    );

  // not sure if label should refer to fieldset display
  return label ? <Fieldset legend={getLabel(label, def)}>{renderFields()}</Fieldset> : renderFields();
}

export { StructField };
