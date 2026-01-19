import { ISailsTypeDef } from 'sails-js-types';

import { Textarea } from '@/components';

import { getLabel } from '../../utils';

type Props = {
  def: ISailsTypeDef;
  name: string;
  label: string;
};

function VecField({ def, name, label }: Props) {
  return <Textarea name={name} label={getLabel(label, def)} />;
}

export { VecField };
