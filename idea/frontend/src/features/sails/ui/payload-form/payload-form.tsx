import { InputWrapper, Select } from '@gear-js/ui';
import { Sails } from 'sails-js';

import { Fields } from '../fields';
import { useConstructor } from '../../hooks';
import { ISailsFuncArg } from '../../types';
import styles from './payload-form.module.scss';

type Props = {
  sails: Sails;
  select: ReturnType<typeof useConstructor>['select'];
  args: ISailsFuncArg[];
};

function PayloadForm({ sails, select, args }: Props) {
  return (
    <InputWrapper id="payload" label="Payload" direction="y" size="normal" className={styles.form}>
      <Select
        label="Constructor"
        direction="y"
        options={select.options}
        value={select.value}
        onChange={select.handleChange}
      />

      <Fields sails={sails} args={args} />
    </InputWrapper>
  );
}

export { PayloadForm };
