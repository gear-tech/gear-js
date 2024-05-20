import { Select } from '@gear-js/ui';

import { EnumDef } from '../../types';

type Props = {
  def: EnumDef;
};

function EnumField({ def }: Props) {
  console.log('def: ', def);

  return <Select options={[]} />;
}

export { EnumField };
