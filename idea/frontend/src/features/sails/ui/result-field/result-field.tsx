import { Select } from '@gear-js/ui';
import { TypeDef } from '../../types';

type Props = {
  def: TypeDef;
};

function ResultField({ def }: Props) {
  return <Select options={[]} />;
}

export { ResultField };
