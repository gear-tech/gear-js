import { Textarea } from '@/shared/ui';

import { TypeDef } from '../../types';
import { getLabel, getType } from '../../utils';

type Props = {
  def: TypeDef;
  name: string;
  label: string;
};

function MapField({ def, name, label }: Props) {
  return <Textarea direction="y" name={name} label={getLabel(label, getType(def))} />;
}

export { MapField };
