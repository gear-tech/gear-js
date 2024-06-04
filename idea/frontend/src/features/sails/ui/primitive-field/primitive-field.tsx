import { Input } from '@gear-js/ui';

import { TypeDef } from '../../types';

type Props = {
  def: TypeDef;
  label: string;
};

function PrimitiveField({ def, label }: Props) {
  return <Input direction="y" label={label} />;
}

export { PrimitiveField };
