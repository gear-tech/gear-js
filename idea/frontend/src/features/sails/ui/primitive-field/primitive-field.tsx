import { Input } from '@/shared/ui';

import { TypeDef } from '../../types';
import { getLabel, getType } from '../../utils';

type Props = {
  def: TypeDef;
  name: string;
  label: string;
};

function PrimitiveField({ def, name, label }: Props) {
  return <Input name={name} direction="y" label={getLabel(label, getType(def))} />;
}

export { PrimitiveField };
