import { TypeDef } from 'sails-js';

import { Input } from '@/shared/ui';

import { getLabel } from '../../utils';

type Props = {
  def: TypeDef;
  name: string;
  label: string;
};

function PrimitiveField({ def, name, label }: Props) {
  return <Input name={name} direction="y" label={getLabel(label, def)} />;
}

export { PrimitiveField };
