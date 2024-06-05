import { Textarea } from '@gear-js/ui';

import { TypeDef } from '../../types';
import { getLabel, getType } from '../../utils';

type Props = {
  def: TypeDef;
  name: string;
};

function VecField({ def, name }: Props) {
  const label = getLabel(name, getType(def));

  return <Textarea direction="y" label={label} />;
}

export { VecField };
