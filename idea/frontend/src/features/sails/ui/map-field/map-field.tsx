import { Textarea } from '@gear-js/ui';

import { TypeDef } from '../../types';

type Props = {
  def: TypeDef;
  label: string;
};

function MapField({ def, label }: Props) {
  return <Textarea direction="y" label={label} />;
}

export { MapField };
