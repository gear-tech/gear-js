import { ISailsTypeDef } from 'sails-js-types';

import { Checkbox, Input } from '@/components';

import { getLabel } from '../../utils';

type Props = {
  def: ISailsTypeDef;
  name: string;
  label: string;
};

function PrimitiveField({ def, name, label }: Props) {
  const props = { name, label: getLabel(label, def) };

  if (def.asPrimitive.isBool) return <Checkbox {...props} />;

  return <Input {...props} />;
}

export { PrimitiveField };
