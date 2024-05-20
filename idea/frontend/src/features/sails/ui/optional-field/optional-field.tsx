import { Select } from '@gear-js/ui';
import { OptionalDef } from '../../types';

type Props = {
  def: OptionalDef;
};

function OptionalField({ def }: Props) {
  return <Select options={[]} />;
}

export { OptionalField };
