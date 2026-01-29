import { Fields, ISailsFuncArg } from '@gear-js/sails-payload-form';
import { Sails } from 'sails-js';

import { Checkbox, Input, Textarea } from '@/components';
import { Select } from '@/components/form/select';

import { Fieldset } from '../fieldset';

type Props = {
  sails: Sails;
  args: ISailsFuncArg[];
};

function SailsPayloadFields({ sails, args }: Props) {
  return (
    <Fields
      sails={sails}
      args={args}
      render={{
        ui: { fieldset: Fieldset, select: Select },
        rhf: { input: Input, textarea: Textarea, checkbox: Checkbox },
      }}
    />
  );
}

export { SailsPayloadFields };
