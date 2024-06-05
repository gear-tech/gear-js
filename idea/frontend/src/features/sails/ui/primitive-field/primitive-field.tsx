import { Input } from '@gear-js/ui';

import { TypeDef } from '../../types';
import { getLabel, getType } from '../../utils';

type Props = {
  def: TypeDef;
  name: string;
};

function PrimitiveField({ def, name }: Props) {
  const label = getLabel(name, getType(def));

  return <Input direction="y" label={label} />;
}

export { PrimitiveField };
