import { Select } from '@gear-js/ui';
import { ResultDef } from '../../types';

type Props = {
  def: ResultDef;
};

function ResultField({ def }: Props) {
  return <Select options={[]} />;
}

export { ResultField };
