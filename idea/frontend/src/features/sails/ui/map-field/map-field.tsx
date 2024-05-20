import { Textarea } from '@gear-js/ui';

import { MapDef } from '../../types';

type Props = {
  def: MapDef;
};

function MapField({ def }: Props) {
  return <Textarea label="Map Field" />;
}

export { MapField };
