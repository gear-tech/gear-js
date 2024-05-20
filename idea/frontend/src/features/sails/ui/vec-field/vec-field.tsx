import { Textarea } from '@gear-js/ui';

import { VecDef } from '../../types';

type Props = {
  def: VecDef;
};

function VecField({ def }: Props) {
  return <Textarea label="Vec Field" />;
}

export { VecField };
