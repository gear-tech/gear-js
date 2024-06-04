import { Fieldset } from '@/shared/ui';

import { TypeDef } from '../../types';

type Props = {
  def: TypeDef;
};

function FixedSizeArrayField({ def }: Props) {
  return <Fieldset legend={'Fixed Size Array'}>fixed size array</Fieldset>;
}

export { FixedSizeArrayField };
