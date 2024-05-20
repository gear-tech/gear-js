import { Fieldset } from '@/shared/ui/fieldset';

import { FixedSizeArrayDef } from '../../types';

type Props = {
  def: FixedSizeArrayDef;
};

function FixedSizeArrayField({ def }: Props) {
  return <Fieldset legend={'Fixed Size Array'}>fixed size array</Fieldset>;
}

export { FixedSizeArrayField };
