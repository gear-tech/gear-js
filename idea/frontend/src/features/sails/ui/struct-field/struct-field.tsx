import { Fieldset } from '@/shared/ui/fieldset';
import { StructDef } from '../../types';

type Props = {
  def: StructDef;
};

function StructField({ def }: Props) {
  return <Fieldset legend={'Struct Field'}>struct</Fieldset>;
}

export { StructField };
