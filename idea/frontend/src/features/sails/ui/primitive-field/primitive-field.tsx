import { Input } from '@gear-js/ui';

import { PrimitiveDef } from '../../types';

type Props = {
  def: PrimitiveDef;
};

function PrimitiveField({ def }: Props) {
  return <Input label="Primitive Field" />;
}

export { PrimitiveField };
